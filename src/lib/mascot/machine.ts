/**
 * Rev — pure, rendering-free state machine for the little crab mascot.
 *
 * No DOM access lives here so the transitions can be unit-tested. The renderer
 * (Rev.svelte) owns rAF, cursor tracking, pupil eye-tracking and sprite drawing;
 * it feeds an `Env` snapshot into `tick` each frame and reads the returned data
 * back out.
 *
 * Coordinate space: `x` is pixels from the left along the viewport bottom edge.
 * `env.cursorX` shares that space; `env.cursorY` is pixels ABOVE the bottom edge
 * (>= 0), so proximity is measured against Rev's actual footing.
 *
 * `tick` mutates and returns the same object (a reducer over a single instance)
 * — cheap for a per-frame loop and still deterministic given `opts.rng`.
 */

export type MascotState = 'wander' | 'idle' | 'follow' | 'hop' | 'wave' | 'sleep' | 'sprint' | 'sit';

export interface MascotData {
	state: MascotState;
	/** State to return to after a one-shot 'hop' / 'wave'. */
	prev: MascotState;
	x: number;
	facing: -1 | 1;

	/** Clicks so far; the 5th kicks off the sprint-to-playground payoff. */
	clickCount: number;

	// timers (ms)
	stateTime: number;
	timeSinceInteraction: number;
	timeSinceCursor: number;

	// wander bookkeeping
	wanderDir: -1 | 1;
	nextDirChange: number;
	idleDuration: number;

	// hop (both the affection hop and its shared airborne timing) / sprint
	hopTime: number;
	hopStartX: number;
	targetX: number | null;
	/** Countdown to the next chance at an affection hop toward the cursor. */
	nextHopCheck: number;

	/** One-shot: set true the frame Rev decides to sprint after the 5th click. */
	payoff: boolean;

	rng: () => number;
}

export interface Env {
	viewportWidth: number;
	/** px from left, or null when the pointer is off-window. */
	cursorX: number | null;
	/** px above the bottom edge (>= 0), or null when off-window. */
	cursorY: number | null;
	/** convenience flag the renderer may set; not required by transitions. */
	cursorNearBottom: boolean;
	/** target x for the post-payoff sprint (e.g. the Playground section). */
	playgroundX: number;
}

export interface CreateOpts {
	x?: number;
	viewportWidth?: number;
	/** Start in 'sit' (reduced-motion / touch). */
	sit?: boolean;
	rng?: () => number;
}

// --- tuning ---
const FOLLOW_RADIUS = 140; // px, cursor proximity to start following
const FOLLOW_STOP = 24; // px, stop this close to the cursor
const WALK_SPEED = 34; // px/s, wander pace
const FOLLOW_MAX = 90; // px/s, cap while following
const SPRINT_SPEED = WALK_SPEED * 3; // px/s
const SLEEP_AFTER = 25_000; // ms of no interaction
const CURSOR_LOST = 1_500; // ms of cursor away before follow -> wander
const HOP_DURATION = 450; // ms one-shot arc
const WAVE_DURATION = 600; // ms one-shot claw wave
const SPRINT_SETTLE = 4; // px, close enough to the sprint target
const EDGE_MIN = 8; // px, left clamp
const EDGE_MARGIN = 36; // px, right clamp keeps clear of footer links

// affection hop: a single scamper toward the cursor when it lingers nearby
const HOP_MIN_DIST = 140; // px, cursor must be at least this far horizontally
const HOP_MAX_DIST = 420; // px, ...and no farther than this
const HOP_DISTANCE = 50; // px, how far the hop carries Rev
const HOP_RETRY = 2000; // ms, re-check soon when conditions weren't met

export { HOP_DURATION, WAVE_DURATION };

function clampX(x: number, viewportWidth: number): number {
	const max = Math.max(EDGE_MIN, viewportWidth - EDGE_MARGIN);
	return Math.min(Math.max(x, EDGE_MIN), max);
}

function cursorDistance(state: MascotData, env: Env): number {
	if (env.cursorX == null || env.cursorY == null) return Infinity;
	const dx = env.cursorX - state.x;
	const dy = env.cursorY;
	return Math.hypot(dx, dy);
}

/** 2000–5000ms between wander direction changes. */
function nextDirInterval(rng: () => number): number {
	return 2000 + rng() * 3000;
}

/** 3000–8000ms idle pauses. */
function idleInterval(rng: () => number): number {
	return 3000 + rng() * 5000;
}

/** 8000–20000ms between affection-hop attempts. */
function hopInterval(rng: () => number): number {
	return 8000 + rng() * 12000;
}

function enter(state: MascotData, next: MascotState): void {
	state.prev = state.state;
	state.state = next;
	state.stateTime = 0;
}

/** Where a one-shot (hop/wave) returns to — never back into a transient/asleep pose. */
function restingState(prev: MascotState): MascotState {
	return prev === 'hop' || prev === 'wave' || prev === 'sleep' || prev === 'sprint'
		? 'wander'
		: prev;
}

export function createMascot(opts: CreateOpts = {}): MascotData {
	const rng = opts.rng ?? Math.random;
	const viewportWidth = opts.viewportWidth ?? 1024;
	return {
		state: opts.sit ? 'sit' : 'wander',
		prev: 'wander',
		x: clampX(opts.x ?? viewportWidth * 0.15, viewportWidth),
		facing: 1,
		clickCount: 0,
		stateTime: 0,
		timeSinceInteraction: 0,
		timeSinceCursor: 0,
		wanderDir: rng() < 0.5 ? -1 : 1,
		nextDirChange: nextDirInterval(rng),
		idleDuration: idleInterval(rng),
		hopTime: 0,
		hopStartX: 0,
		targetX: null,
		nextHopCheck: hopInterval(rng),
		payoff: false,
		rng
	};
}

/** Move x toward target at up to `speed` px/s; returns whether it arrived within `stop`. */
function moveToward(state: MascotData, target: number, speed: number, dtSec: number, stop: number) {
	const dx = target - state.x;
	if (Math.abs(dx) <= stop) return true;
	const step = Math.sign(dx) * Math.min(Math.abs(dx), speed * dtSec);
	state.x += step;
	state.facing = step < 0 ? -1 : 1;
	return false;
}

/** Begin a single arc hop ~HOP_DISTANCE toward the cursor's x. */
function startHop(state: MascotData, env: Env): void {
	const dir = (env.cursorX ?? state.x) >= state.x ? 1 : -1;
	state.hopStartX = state.x;
	state.targetX = clampX(state.x + dir * HOP_DISTANCE, env.viewportWidth);
	state.hopTime = 0;
	state.facing = dir;
	state.nextHopCheck = hopInterval(state.rng);
	enter(state, 'hop');
}

/**
 * From wander/idle only: occasionally hop toward a cursor that's lingering
 * 140–420px away. Ticks the countdown and returns true when a hop was started.
 */
function tryHop(state: MascotData, env: Env, dt: number): boolean {
	state.nextHopCheck -= dt;
	if (state.nextHopCheck > 0) return false;
	if (env.cursorX != null) {
		const hdist = Math.abs(env.cursorX - state.x);
		if (hdist >= HOP_MIN_DIST && hdist <= HOP_MAX_DIST) {
			startHop(state, env);
			return true;
		}
	}
	state.nextHopCheck = HOP_RETRY;
	return false;
}

/**
 * Advance one frame. `dt` is milliseconds since the previous tick (clamp it in
 * the renderer, but we also cap here for safety).
 */
export function tick(state: MascotData, dt: number, env: Env): MascotData {
	dt = Math.min(Math.max(dt, 0), 50);
	const dtSec = dt / 1000;
	const dist = cursorDistance(state, env);
	const cursorNear = dist < FOLLOW_RADIUS;

	state.stateTime += dt;
	state.timeSinceInteraction += dt;
	state.timeSinceCursor = cursorNear ? 0 : state.timeSinceCursor + dt;
	if (cursorNear) state.timeSinceInteraction = 0;

	switch (state.state) {
		case 'sit':
			// static mode: renderer handles reduced-motion / touch; only clicks act.
			break;

		case 'sleep':
			if (cursorNear) enter(state, 'follow');
			break;

		case 'wave':
			if (state.stateTime >= WAVE_DURATION) enter(state, restingState(state.prev));
			break;

		case 'hop': {
			state.hopTime += dt;
			if (state.targetX != null) {
				const p = Math.min(state.hopTime / HOP_DURATION, 1);
				state.x = state.hopStartX + (state.targetX - state.hopStartX) * p;
			}
			if (state.hopTime >= HOP_DURATION) {
				if (state.targetX != null) state.x = state.targetX;
				state.targetX = null;
				enter(state, restingState(state.prev));
			}
			break;
		}

		case 'sprint': {
			const arrived = moveToward(
				state,
				state.targetX ?? state.x,
				SPRINT_SPEED,
				dtSec,
				SPRINT_SETTLE
			);
			if (arrived) {
				state.targetX = null;
				enter(state, 'wander');
			}
			break;
		}

		case 'follow':
			if (!cursorNear) {
				if (state.timeSinceCursor > CURSOR_LOST) enter(state, 'wander');
			} else if (env.cursorX != null) {
				moveToward(state, env.cursorX, FOLLOW_MAX, dtSec, FOLLOW_STOP);
			}
			break;

		case 'idle':
			if (cursorNear) {
				enter(state, 'follow');
			} else if (state.timeSinceInteraction > SLEEP_AFTER) {
				enter(state, 'sleep');
			} else if (tryHop(state, env, dt)) {
				// scampered off toward the cursor
			} else if (state.stateTime >= state.idleDuration) {
				state.wanderDir = state.rng() < 0.5 ? -1 : 1;
				state.nextDirChange = nextDirInterval(state.rng);
				enter(state, 'wander');
			}
			break;

		case 'wander':
		default:
			if (cursorNear) {
				enter(state, 'follow');
			} else if (state.timeSinceInteraction > SLEEP_AFTER) {
				enter(state, 'sleep');
			} else if (tryHop(state, env, dt)) {
				// scampered off toward the cursor
			} else {
				state.x += state.wanderDir * WALK_SPEED * dtSec;
				state.facing = state.wanderDir;
				state.nextDirChange -= dt;
				if (state.nextDirChange <= 0) {
					if (state.rng() < 0.4) {
						state.idleDuration = idleInterval(state.rng);
						enter(state, 'idle');
					} else {
						state.wanderDir = state.rng() < 0.5 ? -1 : 1;
						state.nextDirChange = nextDirInterval(state.rng);
					}
				}
			}
			break;
	}

	// keep Rev on-screen and clear of the footer contact links
	state.x = clampX(state.x, env.viewportWidth);
	return state;
}

/** Pointer moved near Rev: counts as interaction and wakes from sleep. */
export function pointerNear(state: MascotData): MascotData {
	state.timeSinceInteraction = 0;
	if (state.state === 'sleep') enter(state, 'follow');
	return state;
}

/**
 * Click: raise a claw in a wave, count it, and on the exact 5th click kick off
 * the sprint-to-playground payoff. In 'sit' mode (reduced-motion / touch) the
 * count still happens and the payoff still fires, but Rev stays put — the
 * renderer decides whether to animate the wave (skipped under reduced-motion).
 */
export function click(state: MascotData, env: Env): MascotData {
	state.clickCount += 1;
	state.timeSinceInteraction = 0;

	const fifth = state.clickCount === 5;

	if (state.state === 'sit') {
		if (fifth) state.payoff = true;
		return state;
	}

	if (fifth) {
		state.targetX = clampX(env.playgroundX, env.viewportWidth);
		state.payoff = true;
		enter(state, 'sprint');
	} else if (state.state !== 'sprint') {
		// wave greets from anywhere non-critical; it returns to a resting state.
		enter(state, 'wave');
	}
	return state;
}
