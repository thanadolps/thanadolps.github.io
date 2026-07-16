<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';

	let { children } = $props();

	// A note for the visitors who open devtools — they're the secondary audience.
	if (browser) {
		console.log(
			'%c🦀 < you found the service hatch.\n' +
				'Source: https://github.com/thanadolps/thanadolps.github.io\n' +
				'No trackers in here, just the crab.',
			'font-family: monospace'
		);
	}
</script>

<a class="skip-link mono" href="#top">Skip to content</a>

{@render children()}

<style>
	.skip-link {
		position: fixed;
		top: 0.5rem;
		left: 0.5rem;
		z-index: 100;
		padding: 0.5rem 1rem;
		background: var(--paper-raised);
		border: 1px solid var(--accent);
		border-radius: var(--radius);
		color: var(--accent);
		text-decoration: none;
		transform: translateY(-200%);
	}

	.skip-link:focus-visible {
		transform: none;
	}
</style>
