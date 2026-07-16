<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import FeaturedProject from '$lib/components/FeaturedProject.svelte';
	import Playground from '$lib/components/Playground.svelte';
	import CraftShelf from '$lib/components/CraftShelf.svelte';
	import Honors from '$lib/components/Honors.svelte';
	import ExperienceTimeline from '$lib/components/ExperienceTimeline.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Rev from '$lib/mascot/Rev.svelte';
	import { site } from '$lib/data/site';
	import { projects } from '$lib/data/projects';

	const ogImage = `${site.url}/og.png`;
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.metaDescription} />
	<link rel="canonical" href={site.url} />
	<meta property="og:title" content={site.title} />
	<meta property="og:description" content={site.metaDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={site.url} />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Nav />

<main id="top">
	<Hero />

	<section id="projects" class="container-wide">
		<SectionHeader title={site.sections.projects.title} lede={site.sections.projects.lede} />
		<div class="projects-list">
			{#each projects as project, i (project.id)}
				<FeaturedProject {project} index={i} />
			{/each}
		</div>
	</section>

	<CraftShelf />
	<Playground />
	<Honors />
	<ExperienceTimeline />
	<Footer />
</main>

<Rev />

<style>
	.projects-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-block);
	}
</style>
