<script lang="ts">
	import type { Project } from '$lib/data/types';

	interface Props {
		project: Project;
		/** id applied to the mono title, so a parent region can aria-labelledby it. */
		titleId?: string;
	}

	let { project, titleId }: Props = $props();
</script>

<!--
	The window's visual identity: OS-style chrome (dots + mono titlebar) over a
	body of screenshot, description, tech chips and links. Presentational only —
	positioning / open-close logic lives in FeaturedProject.
-->
<div class="window">
	<div class="titlebar">
		<span class="dots" aria-hidden="true">
			<span class="dot"></span>
			<span class="dot"></span>
			<span class="dot"></span>
		</span>
		<span class="title mono" id={titleId}>{project.window}</span>
	</div>

	<div class="body">
		{#if project.image}
			<div class="shot">
				<!-- eager + fixed box: the popup is measured for viewport clamping right
				     after it opens, so its height must not change when the image arrives -->
				<img src={project.image} alt={project.imageAlt ?? ''} />
			</div>
		{/if}

		<div class="prose">
			{#each project.description as para}
				<p>{para}</p>
			{/each}

			{#if project.award}
				<p class="award mono">★ {project.award}</p>
			{/if}

			{#if project.tech.length}
				<ul class="chips" aria-label="Tech stack">
					{#each project.tech as t}
						<li class="chip mono">{t}</li>
					{/each}
				</ul>
			{/if}

			<ul class="links">
				{#each project.links as link}
					<li>
						{#if link.url}
							<a
								class="mono link"
								href={link.url}
								target="_blank"
								rel="noopener noreferrer">{link.label} ↗</a
							>
						{:else}
							<span class="mono link-muted">{link.label}{#if link.note} — {link.note}{/if}</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	.window {
		width: 26rem;
		max-width: 90vw;
		background: var(--paper-raised);
		border: 1px solid var(--line-strong);
		border-radius: var(--radius-window);
		box-shadow: var(--shadow);
		overflow: hidden;
		text-align: left;
	}

	.titlebar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		background: var(--paper-raised);
		border-bottom: 1px solid var(--line);
	}

	.dots {
		display: inline-flex;
		gap: 0.375rem;
		flex: none;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1px solid var(--line-strong);
		background: transparent;
		transition: background-color var(--dur-fast) var(--ease-out);
	}

	.window:hover .dot {
		background: var(--accent);
		border-color: var(--accent);
	}

	.title {
		font-size: var(--text-xs);
		color: var(--muted);
		letter-spacing: 0.01em;
	}

	.shot {
		/* fixed, not max: the popup is position-clamped from a measurement taken
		   at open; a late-loading image must not grow the window afterwards */
		height: 13rem;
		overflow: hidden;
		border-bottom: 1px solid var(--line);
		background: var(--paper);
	}

	.shot img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.prose {
		padding: 0.875rem 1rem 1rem;
	}

	.prose p {
		margin: 0 0 0.6rem;
		font-size: var(--text-sm);
		line-height: var(--leading-body);
		color: var(--ink);
	}

	.award {
		font-size: var(--text-xs);
		color: var(--accent);
		letter-spacing: 0.01em;
	}

	.chips {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin: 0.75rem 0 0;
		padding: 0;
	}

	.chip {
		font-size: var(--text-xs);
		color: var(--muted);
		border: 1px solid var(--line-strong);
		border-radius: 999px;
		padding: 2px 8px;
	}

	.links {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem 1rem;
		margin: 0.85rem 0 0;
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
	}
</style>
