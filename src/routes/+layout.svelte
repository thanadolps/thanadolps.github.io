<script lang="ts">
	import '../app.css';

	let { children } = $props();
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
