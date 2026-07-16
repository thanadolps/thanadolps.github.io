<script lang="ts">
	import { onDestroy } from 'svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import type { Project } from '$lib/data/types';
	import ProjectWindow from './ProjectWindow.svelte';
	import { windowState, openWindow, closeWindow } from './featured-state.svelte';

	interface Props {
		project: Project;
		index: number;
	}

	let { project, index }: Props = $props();

	const id = $derived(project.id);
	const num = $derived(String(index + 1).padStart(2, '0'));
	const contentId = $derived(`pw-${project.id}`);
	const titleId = $derived(`pwt-${project.id}`);

	// Only one window open across all rows — coordinated via the shared store.
	const open = $derived(windowState.openId === project.id);

	let isDesktop = $state(false);
	let reducedMotion = $state(false);

	let rowEl: HTMLElement | undefined = $state();
	let winEl: HTMLElement | undefined = $state();
	let buttonEl: HTMLButtonElement | undefined = $state();
	let popupStyle = $state('');

	let openTimer: ReturnType<typeof setTimeout> | undefined;
	let closeTimer: ReturnType<typeof setTimeout> | undefined;
	// Esc restores focus to the button; that focusin must not reopen the window.
	let suppressOpen = false;

	// --- media queries: branch desktop hover-window vs touch accordion ---
	$effect(() => {
		const mqHover = matchMedia('(hover: hover) and (pointer: fine)');
		const mqRM = matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => {
			isDesktop = mqHover.matches;
			reducedMotion = mqRM.matches;
		};
		sync();
		mqHover.addEventListener('change', sync);
		mqRM.addEventListener('change', sync);
		return () => {
			mqHover.removeEventListener('change', sync);
			mqRM.removeEventListener('change', sync);
		};
	});

	// --- hover intent (desktop only) ---
	function onRowEnter() {
		if (!isDesktop) return;
		clearTimeout(closeTimer);
		clearTimeout(openTimer);
		openTimer = setTimeout(() => openWindow(id), 150);
	}

	function onRowLeave() {
		if (!isDesktop) return;
		clearTimeout(openTimer);
		clearTimeout(closeTimer);
		// grace period lets the pointer cross the gap into the window
		closeTimer = setTimeout(() => closeWindow(id), 90);
	}

	function cancelClose() {
		clearTimeout(closeTimer);
	}

	// --- keyboard / focus ---
	function onFocusIn() {
		if (suppressOpen) return;
		if (isDesktop) openWindow(id);
	}

	function onFocusOut(e: FocusEvent) {
		const next = e.relatedTarget as Node | null;
		if (next && rowEl?.contains(next)) return; // focus stayed inside (e.g. a window link)
		if (isDesktop) closeWindow(id);
	}

	function toggle() {
		if (isDesktop) {
			// focus already opens the window; Enter/click should keep it open, not toggle
			openWindow(id);
		} else if (open) {
			closeWindow(id);
		} else {
			openWindow(id);
		}
	}

	// Esc closes and restores focus to the toggle.
	$effect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeWindow(id);
				suppressOpen = true;
				buttonEl?.focus();
				queueMicrotask(() => (suppressOpen = false));
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	// --- positioning: measure after open, clamp into viewport, re-clamp on scroll/resize ---
	function reposition() {
		if (!rowEl || !winEl) return;
		const row = rowEl.getBoundingClientRect();
		const w = winEl.offsetWidth;
		const h = winEl.offsetHeight;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const gap = 12;
		const margin = 8;

		let leftVP: number;
		let originX: 'left' | 'right';
		if (row.right + gap + w + margin <= vw) {
			leftVP = row.right + gap;
			originX = 'left';
		} else if (row.left - gap - w - margin >= 0) {
			leftVP = row.left - gap - w;
			originX = 'right';
		} else {
			// neither side fits beside a wide row — overlap toward the right, then clamp
			leftVP = vw - w - margin;
			originX = 'right';
		}
		leftVP = Math.max(margin, Math.min(leftVP, vw - w - margin));

		let topVP = row.top;
		let originY: 'top' | 'bottom' = 'top';
		if (topVP + h + margin > vh) {
			topVP = row.bottom - h; // flip to align with the row's bottom
			originY = 'bottom';
		}
		topVP = Math.max(margin, Math.min(topVP, vh - h - margin));

		// container is position:relative, so convert viewport coords to row-relative
		popupStyle = `left:${leftVP - row.left}px;top:${topVP - row.top}px;transform-origin:${originX} ${originY};`;
	}

	$effect(() => {
		if (!open || !isDesktop) return;
		let raf = requestAnimationFrame(reposition);
		const onScrollResize = () => reposition();
		window.addEventListener('scroll', onScrollResize, true);
		window.addEventListener('resize', onScrollResize);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('scroll', onScrollResize, true);
			window.removeEventListener('resize', onScrollResize);
		};
	});

	// scale(0.96)->1 + translateY(4px)->0 + fade, no overshoot; instant if reduced-motion
	function popIn(_node: HTMLElement) {
		if (reducedMotion) return { duration: 0 };
		return {
			duration: 240,
			easing: quintOut,
			css: (t: number) =>
				`opacity:${t}; transform: translateY(${(1 - t) * 4}px) scale(${0.96 + t * 0.04});`
		};
	}

	onDestroy(() => {
		clearTimeout(openTimer);
		clearTimeout(closeTimer);
	});
</script>

<div
	class="row"
	class:open
	role="group"
	bind:this={rowEl}
	onpointerenter={onRowEnter}
	onpointerleave={onRowLeave}
	onfocusin={onFocusIn}
	onfocusout={onFocusOut}
>
	<div class="index mono">
		<span class="num">{num}</span>
		<span class="years">{project.years}</span>
	</div>

	<div class="main">
		<button
			class="name"
			bind:this={buttonEl}
			aria-expanded={open}
			aria-controls={open ? contentId : undefined}
			onclick={toggle}
		>
			{project.name}
		</button>

		<p class="tagline">{project.tagline}</p>

		{#if project.award}
			<p class="award mono">★ {project.award}</p>
		{/if}

		<ul class="links">
			{#each project.links as link}
				<li>
					{#if link.url}
						<a class="mono link" href={link.url} target="_blank" rel="noopener noreferrer"
							>{link.label} ↗</a
						>
					{:else}
						<span class="mono link-muted">
							{link.note ? `${link.label} · ${link.note}` : link.label}
						</span>
					{/if}
				</li>
			{/each}
		</ul>
	</div>

	{#if open && isDesktop}
		<div
			class="popup"
			id={contentId}
			bind:this={winEl}
			style={popupStyle}
			role="region"
			aria-labelledby={titleId}
			onpointerenter={cancelClose}
			transition:popIn
		>
			<ProjectWindow {project} {titleId} escHint />
		</div>
	{/if}
</div>

{#if open && !isDesktop}
	<div
		class="accordion"
		id={contentId}
		role="region"
		aria-labelledby={titleId}
		transition:slide={{ duration: reducedMotion ? 0 : 220 }}
	>
		<ProjectWindow {project} {titleId} />
	</div>
{/if}

<style>
	.row {
		position: relative;
		display: grid;
		grid-template-columns: 4rem 1fr;
		gap: 1.5rem;
		padding: 2.25rem 1.25rem;
		margin-inline: -1.25rem;
		border-radius: var(--radius);
		transition: background-color var(--dur-fast) var(--ease-out);
	}

	/* hairline stays aligned with the container edge despite the hover-wash overhang */
	.row::before {
		content: '';
		position: absolute;
		top: 0;
		left: 1.25rem;
		right: 1.25rem;
		border-top: 1px solid var(--line);
	}

	@media (hover: hover) and (pointer: fine) {
		.row:hover {
			background-color: var(--accent-soft);
		}
	}

	.index {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding-top: 0.4rem;
	}

	.num {
		color: var(--accent);
		font-size: var(--text-sm);
		font-weight: 500;
	}

	.years {
		color: var(--muted);
		font-size: var(--text-xs);
	}

	.main {
		min-width: 0;
	}

	.name {
		display: inline-block;
		margin: 0 0 0.4rem;
		padding: 0 0 2px;
		border: none;
		background: none;
		/* the dotted rule is the "this opens" affordance — see critique H6 */
		border-bottom: 1px dotted var(--line-strong);
		font-family: var(--font-display);
		font-size: var(--text-title);
		font-weight: 500;
		line-height: var(--leading-tight);
		color: var(--ink);
		text-align: left;
		cursor: pointer;
		transition:
			color var(--dur-fast) var(--ease-out),
			border-color var(--dur-fast) var(--ease-out);
	}

	.name:hover,
	.row.open .name {
		color: var(--accent);
		border-bottom-color: var(--accent);
	}

	.name:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 3px;
		border-radius: 2px;
	}

	.tagline {
		margin: 0;
		max-width: 38rem; /* keep wrapped lines under ~75ch inside the wide column */
		font-size: var(--text-base);
		line-height: var(--leading-body);
		color: var(--muted);
	}

	.award {
		margin: 0.5rem 0 0;
		font-size: var(--text-xs);
		color: var(--accent);
		letter-spacing: 0.01em;
	}

	.links {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 1.25rem;
		margin: 0.75rem 0 0;
		padding: 0;
	}

	.link {
		font-size: var(--text-xs);
		color: var(--accent);
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: border-color var(--dur-fast) var(--ease-out);
	}

	.link:hover,
	.link:focus-visible {
		border-bottom-color: var(--accent);
	}

	.link-muted {
		font-size: var(--text-xs);
		color: var(--muted);
		cursor: default;
	}

	.popup {
		position: absolute;
		z-index: 60;
		top: 0;
		left: 0;
		/* left/top/transform-origin supplied inline after measurement */
	}

	.accordion {
		margin: 0 0 0.5rem;
		overflow: hidden;
	}

	@media (max-width: 34rem) {
		.row {
			grid-template-columns: 1fr;
			gap: 0.5rem;
			padding: 1.5rem 0;
			/* no hover wash on touch — reclaim the gutter the bleed margin removes */
			margin-inline: 0;
		}

		.row::before {
			left: 0;
			right: 0;
		}

		.index {
			flex-direction: row;
			align-items: baseline;
			gap: 0.75rem;
			padding-top: 0;
		}
	}
</style>
