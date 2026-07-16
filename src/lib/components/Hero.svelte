<script lang="ts">
	import { site } from '$lib/data/site';
</script>

<section class="hero container">
	<p class="hero-kicker mono">{site.hero.kicker}</p>
	<h1 class="hero-name">{site.name}</h1>
	<p class="hero-thai mono" lang="th">{site.nameThai}</p>
	<p class="hero-role">{site.hero.roleLine}</p>
	{#each site.hero.intro as paragraph (paragraph)}
		<p class="hero-intro">{paragraph}</p>
	{/each}
	<p class="hero-proof mono">{site.hero.proof.join(' · ')}</p>
	<a class="hero-scroll mono" href="#projects">↓ selected work</a>
</section>

<style>
	.hero {
		min-height: 78vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1.1rem;
		padding-block: 3rem;
	}

	.hero-kicker {
		color: var(--muted);
		margin: 0 0 0.5rem;
	}

	.hero-name {
		font-size: var(--text-hero);
		font-variation-settings: 'opsz' 40;
		margin: 0;
	}

	.hero-thai {
		color: var(--muted);
		font-size: var(--text-sm);
		letter-spacing: 0.06em;
		margin: -0.35rem 0 0;
	}

	.hero-role {
		font-size: var(--text-lg);
		max-width: 38rem;
		margin: 0.5rem 0 0;
	}

	.hero-intro {
		color: var(--muted);
		max-width: 38rem;
		margin: 0;
	}

	.hero-proof {
		color: var(--accent);
		font-size: var(--text-xs);
		letter-spacing: 0.02em;
		max-width: 38rem;
		margin: 0.25rem 0 0;
	}

	.hero-scroll {
		display: inline-block;
		margin-top: 1rem;
		color: var(--muted);
		text-decoration: none;
	}

	.hero-scroll:hover,
	.hero-scroll:focus-visible {
		color: var(--accent);
	}

	/* On small screens 78vh leaves a long dead scroll before the first section. */
	@media (max-width: 640px) {
		.hero {
			min-height: 0;
			padding-block: 4rem 3.5rem;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.hero {
			animation: hero-fade-up 700ms var(--ease-out) both;
		}
	}

	@keyframes hero-fade-up {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
