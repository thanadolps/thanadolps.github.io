<script lang="ts">
	import type { PlaygroundDemo } from '$lib/data/types';

	let { demo }: { demo: PlaygroundDemo } = $props();

	let running = $state(false);
</script>

<div class="demo">
	<div class="demo-frame" style="aspect-ratio: {demo.aspect};">
		{#if running}
			<iframe class="demo-embed" src={demo.src} title={demo.name} loading="lazy"></iframe>
		{:else}
			{#if demo.poster}
				<img class="demo-poster" src={demo.poster} alt="" loading="lazy" />
			{/if}
			<button type="button" class="demo-run mono" onclick={() => (running = true)}>
				run ↗
			</button>
		{/if}
	</div>
	<h3 class="demo-name">{demo.name}</h3>
	<p class="demo-blurb">{demo.blurb}</p>
	{#if demo.sourceUrl}
		<a class="demo-source mono" href={demo.sourceUrl} target="_blank" rel="noopener">source ↗</a>
	{/if}
</div>

<style>
	.demo-frame {
		position: relative;
		width: 100%;
		border: 1px solid var(--line-strong);
		border-radius: var(--radius);
		overflow: hidden;
		background: var(--paper-raised);
	}

	.demo-poster {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.demo-embed {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
		display: block;
	}

	.demo-run {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--paper-raised);
		border: 1px solid var(--line-strong);
		border-radius: var(--radius);
		padding: 0.6rem 1.25rem;
		cursor: pointer;
		color: var(--ink);
		transition:
			border-color var(--dur-fast) var(--ease-out),
			color var(--dur-fast) var(--ease-out);
	}

	.demo-run:hover,
	.demo-run:focus-visible {
		border-color: var(--accent);
		color: var(--accent);
	}

	.demo-name {
		font-size: var(--text-xl);
		margin: 1rem 0 0.35rem;
	}

	.demo-blurb {
		color: var(--muted);
		margin: 0;
	}

	.demo-source {
		display: inline-block;
		margin-top: 0.5rem;
		color: var(--muted);
		text-decoration: none;
	}

	.demo-source:hover,
	.demo-source:focus-visible {
		color: var(--accent);
	}
</style>
