<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createMascot, tick, click, type MascotData, type Env } from './machine';
	import { frames, cells, type FrameKey } from './sprites';

	// distance from the viewport bottom to Rev's vertical centre (layer bottom + half disc)
	const BOTTOM_OFFSET = 22;

	let mounted = $state(false);
	let mode: 'full' | 'sit' = $state('sit');

	// render state (kept separate from the machine so the rAF loop stays cheap)
	let x = $state(0);
	let vw = $state(1024);
	let facing = $state<1 | -1>(1);
	let color = $state<'black' | 'white'>('black');
	let frameKey = $state<FrameKey>('stand');
	let hopY = $state(0);
	let showBubble = $state(false);

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
		color = machine.color;
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

		hopY = s === 'hop' ? Math.sin((machine.hopTime / 450) * Math.PI) * 10 : 0;
		frameKey = pickFrame(s);
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
		color = machine.color;
		frameKey = pickFrame(machine.state);
		consumePayoff();
	}

	function dismissBubble() {
		showBubble = false;
		clearTimeout(bubbleTimer);
	}

	// decide mode once on the client (SSR renders nothing)
	$effect(() => {
		const coarse =
			matchMedia('(pointer: coarse)').matches || !matchMedia('(hover: hover)').matches;
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const noRaf = typeof requestAnimationFrame === 'undefined';
		mode = coarse || reduced || noRaf ? 'sit' : 'full';
		mounted = true;
	});

	// drive the mascot
	$effect(() => {
		if (!mounted) return;
		vw = window.innerWidth;

		if (mode === 'sit') {
			// static bottom-right; still clickable to flip, bubble still possible
			machine = createMascot({ viewportWidth: vw, sit: true, x: vw - 36 });
			const place = () => {
				vw = window.innerWidth;
				x = Math.max(8, vw - 36);
			};
			place();
			color = machine.color;
			frameKey = 'stand';
			window.addEventListener('resize', place);
			return () => window.removeEventListener('resize', place);
		}

		// full mode: rAF loop
		machine = createMascot({ viewportWidth: vw, x: vw * 0.15 });
		x = machine.x;
		color = machine.color;
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

	onDestroy(() => clearTimeout(bubbleTimer));
</script>

{#if mounted}
	<div class="rev-layer" aria-hidden="true">
		<!-- decorative: the whole layer is aria-hidden and out of tab order;
		     the click target is a mouse affordance only, so no keyboard handler -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="disc {color}"
			style="transform: translate({x}px, {-hopY}px) scaleX({facing});"
			tabindex="-1"
			onclick={onClick}
		>
			<svg class="sprite" viewBox="0 0 14 14" width="28" height="28" shape-rendering="crispEdges">
				{#each disc as c (`${c.x}-${c.y}-${c.type}`)}
					<rect x={c.x} y={c.y} width="1" height="1" class="c-{c.type}" />
				{/each}
			</svg>
		</div>

		{#if showBubble}
			<a class="bubble mono" href="#playground" style="left: {bubbleLeft}px;" onclick={dismissBubble}>
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
		width: 28px;
		height: 28px;
		pointer-events: auto;
		cursor: pointer;
		transform-origin: 50% 100%;
		-webkit-tap-highlight-color: transparent;
	}

	.sprite {
		display: block;
		image-rendering: pixelated;
	}

	/* colour roles, switched by disc colour; all resolve to theme tokens */
	.disc.black {
		--c-body: var(--ink);
		--c-ring: var(--ink);
		--c-eye: var(--paper-raised);
		--c-foot: var(--ink);
		--c-z: var(--muted);
	}

	.disc.white {
		--c-body: var(--paper-raised);
		--c-ring: var(--ink);
		--c-eye: var(--ink);
		--c-foot: var(--ink);
		--c-z: var(--muted);
	}

	.c-body {
		fill: var(--c-body);
	}
	.c-ring {
		fill: var(--c-ring);
	}
	.c-eye {
		fill: var(--c-eye);
	}
	.c-foot {
		fill: var(--c-foot);
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
