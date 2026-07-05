<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { site } from '$lib/data/site';
	import { experience } from '$lib/data/experience';
</script>

<section id="experience" class="container">
	<SectionHeader number={site.sections.experience.number} title={site.sections.experience.title} />
	<ol class="timeline">
		{#each experience as item (item.org + item.period)}
			<li class="timeline-row" class:is-education={item.kind === 'education'}>
				<span class="timeline-marker" class:is-outline={item.kind === 'education'}></span>
				<span class="timeline-period mono">{item.period}</span>
				<div class="timeline-body">
					<p class="timeline-org">
						{item.org} <span class="timeline-role">— {item.role}</span>
						{#if item.kind === 'freelance'}
							<span class="timeline-tag mono">freelance</span>
						{/if}
					</p>
					<p class="timeline-detail">{item.detail}</p>
				</div>
			</li>
		{/each}
	</ol>
</section>

<style>
	.timeline {
		list-style: none;
		margin: 0;
		padding: 0 0 0 1.5rem;
		border-left: 1px solid var(--line);
	}

	.timeline-row {
		position: relative;
		display: grid;
		grid-template-columns: 7rem 1fr;
		gap: 1rem;
		padding: 1.25rem 0;
	}

	.timeline-row.is-education {
		opacity: 0.75;
	}

	.timeline-marker {
		position: absolute;
		left: calc(-1.5rem - 3.5px);
		top: 1.6rem;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--ink);
	}

	.timeline-marker.is-outline {
		background: transparent;
		border: 1px solid var(--ink);
	}

	.timeline-period {
		color: var(--muted);
	}

	.timeline-org {
		margin: 0;
		font-weight: 500;
	}

	.timeline-role {
		font-weight: 400;
		color: var(--muted);
	}

	.timeline-tag {
		margin-left: 0.5rem;
		font-size: var(--text-xs);
		color: var(--accent);
	}

	.timeline-detail {
		margin: 0.25rem 0 0;
		color: var(--muted);
	}

	@media (max-width: 640px) {
		.timeline-row {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}
</style>
