<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import DemoFacade from './DemoFacade.svelte';
	import { site } from '$lib/data/site';
	import { demos } from '$lib/data/playground';
</script>

<section id="playground" class="container-wide">
	<SectionHeader
		number={site.sections.playground.number}
		title={site.sections.playground.title}
		lede={site.sections.playground.lede}
	/>
	<div class="playground-grid">
		{#each demos as demo (demo.id)}
			<DemoFacade {demo} />
		{/each}
	</div>
</section>

<style>
	.playground-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 2.5rem;
	}

	@media (max-width: 720px) {
		.playground-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
