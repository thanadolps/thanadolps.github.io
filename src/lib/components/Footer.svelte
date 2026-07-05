<script lang="ts">
	import SectionHeader from './SectionHeader.svelte';
	import { site } from '$lib/data/site';
</script>

<footer id="contact" class="container">
	<SectionHeader
		number={site.sections.contact.number}
		title={site.sections.contact.title}
		lede={site.contact.lede}
	/>
	<ul class="contact-links">
		<li><a class="mono" href={`mailto:${site.email}`}>{site.email}</a></li>
		<li><a class="mono" href={site.github} target="_blank" rel="noopener">GitHub</a></li>
		<li><a class="mono" href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a></li>
		<li><a class="mono" href={site.medium} target="_blank" rel="noopener">Medium</a></li>
		<li><a class="mono" href={site.resumePath} download>Résumé (PDF)</a></li>
	</ul>
	<div class="colophon">
		<p class="mono colophon-text">{site.colophon}</p>
		<a class="mono colophon-link" href={site.legacySitePath}>the 2019 version of this site</a>
	</div>
</footer>

<style>
	.contact-links {
		list-style: none;
		margin: 0 0 var(--space-block);
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	.contact-links a {
		text-decoration: none;
		color: var(--ink);
	}

	.contact-links a:hover,
	.contact-links a:focus-visible {
		color: var(--accent);
		text-decoration: underline;
	}

	.colophon {
		border-top: 1px solid var(--line);
		padding-top: 1.25rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		align-items: baseline;
	}

	.colophon-text {
		color: var(--muted);
		font-size: var(--text-xs);
		margin: 0;
	}

	.colophon-link {
		color: var(--muted);
		font-size: var(--text-xs);
		text-decoration-color: color-mix(in srgb, var(--muted) 40%, transparent);
	}

	.colophon-link:hover,
	.colophon-link:focus-visible {
		color: var(--accent);
		text-decoration-color: var(--accent);
	}
</style>
