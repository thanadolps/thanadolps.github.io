<script lang="ts">
	import { site } from '$lib/data/site';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ label: 'Work', href: '#projects' },
		{ label: 'Playground', href: '#playground' },
		{ label: 'Experience', href: '#experience' },
		{ label: 'Contact', href: '#contact' }
	];
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

	@media (max-width: 640px) {
		.nav-links {
			display: none;
		}

		.nav-right {
			gap: 1rem;
		}
	}
</style>
