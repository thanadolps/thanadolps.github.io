<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		createMascot,
		tick,
		click,
		HOP_DURATION,
		WAVE_DURATION,
		type MascotData,
		type Env
	} from './machine';
	import { frames, cells, eyesOpen, EYE_L, EYE_R, GRID_W, GRID_H, type FrameKey } from './sprites';

	// pixel size: 16x14 grid drawn 2px/cell -> 32x28 CSS
	const CELL = 2;
	const W = GRID_W * CELL; // 32
	const H = GRID_H * CELL; // 28
	// distance from the viewport bottom to Rev's vertical centre (layer bottom + half height)
	const BOTTOM_OFFSET = 22;

	let mounted = $state(false);
	let mode: 'full' | 'sit' = $state('sit');
	let reduced = false; // reduced-motion (a reason we may be in 'sit')

	// render state (kept separate from the machine so the rAF loop stays cheap)
	let x = $state(0);
	let vw = $state(1024);
	let facing = $state<1 | -1>(1);
	let frameKey = $state<FrameKey>('stand');
	let hopY = $state(0);
	let showBubble = $state(false);
	// pupils are a separate layer positioned by the renderer (cursor tracking)
	let pupils = $state<{ x: number; y: number }[]>([]);

	const disc = $derived(cells(frames[frameKey]));
	const bubbleLeft = $derived(Math.min(Math.max(x - 56, 8), vw - 190));

	// non-reactive internals
	let machine: MascotData;
	let footTimer = 0;
	let footPhase = 0;
	let blinkTimer = 0;
	let blinking = false;
	let nextBlink = 2600;
	let bubbleConsumed = false;
	let bubbleTimer: ReturnType<typeof setTimeout> | undefined;
	let waveTimer: ReturnType<typeof setTimeout> | undefined;
	const cursor = { x: 0, y: 0, active: false };

	function playgroundX(width: number): number {
		const el = typeof document !== 'undefined' ? document.getElementById('playground') : null;
		if (el) {
			const r = el.getBoundingClientRect();
			return Math.min(Math.max(r.left + r.width / 2, 8), width - 36);
		}
		return width * 0.7;
	}

	function makeEnv(): Env {
		vw = window.innerWidth;
		const cx = cursor.active ? cursor.x : null;
		const cy = cursor.active ? Math.max(0, window.innerHeight - cursor.y - BOTTOM_OFFSET) : null;
		return {
			viewportWidth: vw,
			cursorX: cx,
			cursorY: cy,
			cursorNearBottom: cy != null && cy < 160,
			playgroundX: playgroundX(vw)
		};
	}

	function isMoving(s: string) {
		return s === 'wander' || s === 'follow' || s === 'sprint';
	}

	function pickFrame(s: string): FrameKey {
		switch (s) {
			case 'sleep':
				return 'sleep';
			case 'hop':
				return 'squash';
			case 'wave':
				return 'wave';
			case 'wander':
			case 'follow':
			case 'sprint':
				return footPhase ? 'walkB' : 'walkA';
			case 'idle':
			case 'sit':
				return blinking ? 'blink' : 'stand';
			default:
				return 'stand';
		}
	}

	/**
	 * Position the two pupils inside their sockets. Each pupil shifts +/-1 cell
	 * toward the cursor (clamped), centred when no cursor has been seen, and
	 * hidden while the eyes are shut (blink/sleep). Works in both modes.
	 */
	function updatePupils() {
		if (!eyesOpen(frameKey)) {
			pupils = [];
			return;
		}
		let dx = 0;
		let dy = 0;
		if (cursor.active) {
			// horizontal: cursor vs Rev's on-screen centre
			const hdiff = cursor.x - (x + W / 2);
			const vdx = Math.abs(hdiff) < 6 ? 0 : Math.sign(hdiff);
			// the sprite is mirrored by scaleX(facing), so undo it for the pupils
			dx = vdx * facing;
			// vertical: cursor (clientY, top-based) vs the eyes near the bottom edge
			const eyeClientY = window.innerHeight - (BOTTOM_OFFSET + H / 2);
			const vdiff = cursor.y - eyeClientY;
			dy = Math.abs(vdiff) < 8 ? 0 : Math.sign(vdiff);
		}
		pupils = [
			{ x: EYE_L.x + dx, y: EYE_L.y + dy },
			{ x: EYE_R.x + dx, y: EYE_R.y + dy }
		];
	}

	function consumePayoff() {
		if (machine.payoff && !bubbleConsumed) {
			machine.payoff = false;
			bubbleConsumed = true;
			showBubble = true;
			clearTimeout(bubbleTimer);
			bubbleTimer = setTimeout(() => (showBubble = false), 12_000);
		}
	}

	function step(dt: number) {
		const env = makeEnv();
		machine = tick(machine, dt, env);
		x = machine.x;
		facing = machine.facing;
		const s = machine.state;

		if (isMoving(s)) {
			footTimer += dt;
			if (footTimer >= 120) {
				footTimer = 0;
				footPhase ^= 1;
			}
		}

		// blink cadence, only meaningful while standing/idle/sit
		blinkTimer += dt;
		if (!blinking && blinkTimer >= nextBlink) {
			blinking = true;
			blinkTimer = 0;
		} else if (blinking && blinkTimer >= 120) {
			blinking = false;
			blinkTimer = 0;
			nextBlink = 2000 + Math.random() * 3000;
		}

		if (s === 'hop') {
			hopY = Math.sin((machine.hopTime / HOP_DURATION) * Math.PI) * 12;
		} else if (s === 'wave') {
			hopY = Math.sin((machine.stateTime / WAVE_DURATION) * Math.PI) * 4; // tiny bounce
		} else {
			hopY = 0;
		}

		frameKey = pickFrame(s);
		updatePupils();
		consumePayoff();
	}

	function onMove(e: PointerEvent) {
		cursor.x = e.clientX;
		cursor.y = e.clientY;
		cursor.active = true;
	}

	function onLeave() {
		cursor.active = false;
	}

	function onClick() {
		machine = click(machine, makeEnv());
		consumePayoff();
		if (mode === 'sit') {
			// no rAF here: play a brief wave via a timeout when motion is allowed
			if (!reduced && machine.state === 'sit') {
				frameKey = 'wave';
				updatePupils();
				clearTimeout(waveTimer);
				waveTimer = setTimeout(() => {
					frameKey = 'stand';
					updatePupils();
				}, WAVE_DURATION);
			}
		} else {
			// full mode: the machine is now in 'wave'/'sprint'; reflect it at once
			frameKey = pickFrame(machine.state);
			updatePupils();
		}
	}

	function dismissBubble() {
		showBubble = false;
		clearTimeout(bubbleTimer);
	}

	// decide mode once on the client (SSR renders nothing)
	$effect(() => {
		const coarse =
			matchMedia('(pointer: coarse)').matches || !matchMedia('(hover: hover)').matches;
		reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const noRaf = typeof requestAnimationFrame === 'undefined';
		mode = coarse || reduced || noRaf ? 'sit' : 'full';
		mounted = true;
	});

	// drive the mascot
	$effect(() => {
		if (!mounted) return;
		vw = window.innerWidth;

		if (mode === 'sit') {
			// static bottom-right; still clickable, and the eyes still track the cursor
			machine = createMascot({ viewportWidth: vw, sit: true, x: vw - 36 });
			const place = () => {
				vw = window.innerWidth;
				x = Math.max(8, vw - 36);
			};
			place();
			frameKey = 'stand';
			updatePupils();
			window.addEventListener('resize', place);
			// eye-tracking is event-driven here (no rAF) — 1px, so fine under reduced-motion
			window.addEventListener('pointermove', onSitMove, { passive: true });
			window.addEventListener('pointerout', onSitLeave, { passive: true });
			return () => {
				window.removeEventListener('resize', place);
				window.removeEventListener('pointermove', onSitMove);
				window.removeEventListener('pointerout', onSitLeave);
			};
		}

		// full mode: rAF loop
		machine = createMascot({ viewportWidth: vw, x: vw * 0.15 });
		x = machine.x;
		let raf = 0;
		let last = performance.now();
		const loop = (now: number) => {
			let dt = now - last;
			last = now;
			if (dt > 50) dt = 50;
			step(dt);
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		window.addEventListener('pointermove', onMove, { passive: true });
		window.addEventListener('pointerout', onLeave, { passive: true });

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerout', onLeave);
		};
	});

	// sit-mode pointer handlers: keep the cursor fresh and re-aim the pupils
	function onSitMove(e: PointerEvent) {
		onMove(e);
		updatePupils();
	}
	function onSitLeave() {
		onLeave();
		updatePupils();
	}

	onDestroy(() => {
		clearTimeout(bubbleTimer);
		clearTimeout(waveTimer);
	});
</script>

{#if mounted}
	<div class="rev-layer" aria-hidden="true">
		<!-- decorative: the whole layer is aria-hidden and out of tab order;
		     the click target is a mouse affordance only, so no keyboard handler -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="disc"
			style="transform: translate({x}px, {-hopY}px) scaleX({facing});"
			tabindex="-1"
			onclick={onClick}
		>
			<svg
				class="sprite"
				viewBox="0 0 {GRID_W} {GRID_H}"
				width={W}
				height={H}
				shape-rendering="crispEdges"
			>
				{#each disc as c (`${c.x}-${c.y}-${c.type}`)}
					<rect x={c.x} y={c.y} width="1" height="1" class="c-{c.type}" />
				{/each}
				{#each pupils as p, i (i)}
					<rect x={p.x} y={p.y} width="1" height="1" class="c-pupil" />
				{/each}
			</svg>
		</div>

		{#if showBubble}
			<a
				class="bubble mono"
				href="#playground"
				tabindex="-1"
				style="left: {bubbleLeft}px;"
				onclick={dismissBubble}
			>
				play a real game? ↓
			</a>
		{/if}
	</div>
{/if}

<style>
	.rev-layer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 8px;
		height: 0;
		z-index: 40; /* above content, below the project window (z 60) */
		pointer-events: none;
	}

	.disc {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 32px;
		height: 28px;
		pointer-events: auto;
		cursor: pointer;
		transform-origin: 50% 100%;
		-webkit-tap-highlight-color: transparent;

		/* crab colour roles — all resolve to theme tokens */
		--c-body: var(--mascot);
		--c-claw: var(--mascot-deep);
		--c-leg: var(--mascot-deep);
		--c-eye: var(--paper-raised);
		--c-pupil: var(--ink);
		--c-z: var(--muted);
	}

	.sprite {
		display: block;
		image-rendering: pixelated;
	}

	.c-body {
		fill: var(--c-body);
	}
	.c-claw {
		fill: var(--c-claw);
	}
	.c-leg {
		fill: var(--c-leg);
	}
	.c-eyeWhite {
		fill: var(--c-eye);
	}
	.c-pupil {
		fill: var(--c-pupil);
	}
	.c-z {
		fill: var(--c-z);
	}

	.bubble {
		position: absolute;
		bottom: 40px;
		pointer-events: auto;
		white-space: nowrap;
		background: var(--paper-raised);
		border: 1px solid var(--line-strong);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
		padding: 0.35rem 0.6rem;
		font-size: var(--text-xs);
		color: var(--accent);
		text-decoration: none;
	}

	.bubble:hover,
	.bubble:focus-visible {
		border-color: var(--accent);
	}
</style>
