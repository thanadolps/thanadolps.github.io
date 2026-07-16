<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { site } from '$lib/data/site';
	import { awards } from '$lib/data/awards';
</script>

<section id="honors" class="container">
	<SectionHeader title={site.sections.honors.title} />
	<ul class="honors-list">
		{#each awards as award (award.title)}
			<li class="honors-row">
				<span class="honors-year mono">{award.year}</span>
				<div class="honors-body">
					{#if award.url}
						<a class="honors-title" href={award.url} target="_blank" rel="noopener">{award.title}</a>
					{:else}
						<span class="honors-title">{award.title}</span>
					{/if}
					<p class="honors-detail">{award.detail}</p>
				</div>
			</li>
		{/each}
	</ul>
</section>

<style>
	.honors-list {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}

	.honors-row {
		display: grid;
		grid-template-columns: 4rem 1fr;
		gap: 1rem;
		padding: 1rem 0;
		border-bottom: 1px solid var(--line);
	}

	.honors-year {
		color: var(--muted);
	}

	.honors-title {
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
	}

	a.honors-title:hover,
	a.honors-title:focus-visible {
		color: var(--accent);
		text-decoration: underline;
	}

	.honors-detail {
		color: var(--muted);
		margin: 0.25rem 0 0;
	}

	@media (max-width: 640px) {
		.honors-row {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}
</style>
