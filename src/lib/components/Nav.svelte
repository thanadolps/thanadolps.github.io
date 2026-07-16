<script lang="ts">
	import { site } from '$lib/data/site';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ label: 'Work', href: '#projects' },
		{ label: 'Playground', href: '#playground' },
		{ label: 'Honors', href: '#honors' },
		{ label: 'Experience', href: '#experience' },
		{ label: 'Contact', href: '#contact' }
	];

	let menuEl: HTMLDetailsElement | undefined = $state();

	// The disclosure panel should not stay open after a jump.
	function closeMenu() {
		if (menuEl) menuEl.open = false;
	}
</script>

<nav>
	<div class="nav-inner container-wide">
		<a class="mono nav-name" href="#top">thanadolps</a>
		<div class="nav-right">
			<ul class="nav-links">
				{#each links as link (link.href)}
					<li><a class="mono" href={link.href}>{link.label}</a></li>
				{/each}
			</ul>
			<details class="nav-menu" bind:this={menuEl}>
				<summary class="mono">sections</summary>
				<ul class="nav-menu-panel">
					{#each links as link (link.href)}
						<li><a class="mono" href={link.href} onclick={closeMenu}>{link.label}</a></li>
					{/each}
				</ul>
			</details>
			<a class="mono nav-resume" href={site.resumePath} download>Résumé</a>
			<ThemeToggle />
		</div>
	</div>
</nav>

<style>
	nav {
		position: sticky;
		top: 0;
		z-index: 2;
		background: var(--paper);
		border-bottom: 1px solid var(--line);
	}

	.nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-block: 0.85rem;
	}

	.nav-name {
		text-decoration: none;
		color: var(--ink);
		font-weight: 500;
	}

	.nav-right {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.nav-links {
		display: flex;
		gap: 1.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-links a,
	.nav-resume {
		text-decoration: none;
		color: var(--ink);
		transition: color var(--dur-fast) var(--ease-out);
	}

	.nav-links a:hover,
	.nav-links a:focus-visible,
	.nav-resume:hover,
	.nav-resume:focus-visible {
		color: var(--accent);
	}

	/* -- small-screen disclosure menu (replaces the inline link row) -- */
	.nav-menu {
		display: none;
		position: relative;
	}

	.nav-menu summary {
		list-style: none;
		cursor: pointer;
		color: var(--ink);
		font-size: var(--text-sm);
	}

	.nav-menu summary::-webkit-details-marker {
		display: none;
	}

	.nav-menu summary::after {
		content: ' ▾';
		color: var(--muted);
	}

	.nav-menu[open] summary,
	.nav-menu summary:hover {
		color: var(--accent);
	}

	.nav-menu-panel {
		position: absolute;
		right: -0.75rem;
		top: calc(100% + 0.85rem);
		min-width: 10rem;
		margin: 0;
		padding: 0.4rem 0;
		list-style: none;
		background: var(--paper-raised);
		border: 1px solid var(--line-strong);
		border-radius: var(--radius);
		box-shadow: var(--shadow);
	}

	.nav-menu-panel a {
		display: block;
		padding: 0.5rem 1rem;
		text-decoration: none;
		color: var(--ink);
	}

	.nav-menu-panel a:hover,
	.nav-menu-panel a:focus-visible {
		color: var(--accent);
		background: var(--accent-soft);
	}

	@media (max-width: 640px) {
		.nav-links {
			display: none;
		}

		.nav-menu {
			display: block;
		}

		.nav-right {
			gap: 1rem;
		}
	}
</style>
