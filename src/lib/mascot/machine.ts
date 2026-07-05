/**
 * Rev — pure, rendering-free state machine for the othello-disc mascot.
 *
 * No DOM access lives here so the transitions can be unit-tested. The renderer
 * (Rev.svelte) owns rAF, cursor tracking and sprite drawing; it feeds an `Env`
 * snapshot into `tick` each frame and reads the returned data back out.
 *
 * Coordinate space: `x` is pixels from the left along the viewport bottom edge.
 * `env.cursorX` shares that space; `env.cursorY` is pixels ABOVE the bottom edge
 * (>= 0), so proximity is measured against Rev's actual footing.
 *
 * `tick` mutates and returns the same object (a reducer over a single instance)
 * — cheap for a per-frame loop and still deterministic given `opts.rng`.
 */

export type MascotState = 'wander' | 'idle' | 'follow' | 'hop' | 'sleep' | 'sprint' | 'sit';
export type MascotColor = 'black' | 'white';

export interface MascotData {
	state: MascotState;
	/** State to return to after a one-shot 'hop'. */
	prev: MascotState;
	x: number;
	facing: -1 | 1;
	color: MascotColor;
	flipCount: number;

	// timers (ms)
	stateTime: number;
	timeSinceInteraction: number;
	timeSinceCursor: number;

	// wander bookkeeping
	wanderDir: -1 | 1;
	nextDirChange: number;
	idleDuration: number;

	// hop / sprint
	hopTime: number;
	targetX: number | null;

	/** One-shot: set true the frame Rev decides to sprint after the 5th flip. */
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
	color?: MascotColor;
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
const HOP_DURATION = 450; // ms one-shot
const SPRINT_SETTLE = 4; // px, close enough to the sprint target
const EDGE_MIN = 8; // px, left clamp
const EDGE_MARGIN = 36; // px, right clamp keeps clear of footer links

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

function enter(state: MascotData, next: MascotState): void {
	state.prev = state.state;
	state.state = next;
	state.stateTime = 0;
}

export function createMascot(opts: CreateOpts = {}): MascotData {
	const rng = opts.rng ?? Math.random;
	const viewportWidth = opts.viewportWidth ?? 1024;
	return {
		state: opts.sit ? 'sit' : 'wander',
		prev: 'wander',
		x: clampX(opts.x ?? viewportWidth * 0.15, viewportWidth),
		facing: 1,
		color: opts.color ?? 'black',
		flipCount: 0,
		stateTime: 0,
		timeSinceInteraction: 0,
		timeSinceCursor: 0,
		wanderDir: rng() < 0.5 ? -1 : 1,
		nextDirChange: nextDirInterval(rng),
		idleDuration: idleInterval(rng),
		hopTime: 0,
		targetX: null,
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

		case 'hop':
			state.hopTime += dt;
			if (state.hopTime >= HOP_DURATION) {
				const back = state.prev === 'hop' || state.prev === 'sleep' ? 'wander' : state.prev;
				enter(state, back);
			}
			break;

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
 * Click: flip colour with a hop, count it, and on the exact 5th flip kick off
 * the sprint-to-playground payoff. In 'sit' mode (reduced-motion / touch) the
 * flip and count still happen and the payoff still fires, but Rev stays put.
 */
export function click(state: MascotData, env: Env): MascotData {
	state.color = state.color === 'black' ? 'white' : 'black';
	state.flipCount += 1;
	state.timeSinceInteraction = 0;

	const fifth = state.flipCount === 5;

	if (state.state === 'sit') {
		if (fifth) state.payoff = true;
		return state;
	}

	if (fifth) {
		state.targetX = clampX(env.playgroundX, env.viewportWidth);
		state.payoff = true;
		enter(state, 'sprint');
	} else {
		state.hopTime = 0;
		enter(state, 'hop');
	}
	return state;
}
