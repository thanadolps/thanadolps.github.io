<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { site } from '$lib/data/site';
	import { craft } from '$lib/data/craft';
</script>

<section id="craft" class="container">
	<SectionHeader
		number={site.sections.craft.number}
		title={site.sections.craft.title}
		lede={site.sections.craft.lede}
	/>
	<ul class="craft-list">
		{#each craft as item (item.name)}
			<li class="craft-row">
				{#if item.url}
					<a class="craft-row-inner craft-row-link" href={item.url} target="_blank" rel="noopener">
						<span class="craft-name mono">{item.name}</span>
						<span class="craft-lang mono">{item.lang}</span>
						<span class="craft-blurb">{item.blurb}</span>
					</a>
				{:else}
					<div class="craft-row-inner">
						<span class="craft-name mono">{item.name}</span>
						<span class="craft-lang mono">{item.lang}</span>
						<span class="craft-blurb craft-blurb--muted">{item.blurb}</span>
						{#if item.note}
							<span class="craft-note mono">{item.note}</span>
						{/if}
					</div>
				{/if}
			</li>
		{/each}
	</ul>
</section>

<style>
	.craft-list {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}

	.craft-row {
		border-bottom: 1px solid var(--line);
	}

	.craft-row-inner {
		display: grid;
		grid-template-columns: 9rem 5rem 1fr auto;
		gap: 1rem;
		align-items: baseline;
		padding: 0.85rem 0.5rem;
	}

	a.craft-row-inner {
		color: var(--ink);
		text-decoration: none;
		transition: background var(--dur-fast) var(--ease-out);
	}

	a.craft-row-inner:hover,
	a.craft-row-inner:focus-visible {
		background: var(--accent-soft);
	}

	a.craft-row-inner:hover .craft-name,
	a.craft-row-inner:focus-visible .craft-name {
		color: var(--accent);
	}

	.craft-name {
		font-weight: 500;
	}

	.craft-lang {
		color: var(--muted);
		font-size: var(--text-xs);
	}

	.craft-blurb--muted {
		color: var(--muted);
	}

	.craft-note {
		display: inline-block;
		justify-self: start;
		padding: 0.15rem 0.6rem;
		border-radius: 999px;
		background: var(--line);
		color: var(--muted);
		font-size: var(--text-xs);
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.craft-row-inner {
			grid-template-columns: 1fr;
			gap: 0.3rem;
		}
	}
</style>
