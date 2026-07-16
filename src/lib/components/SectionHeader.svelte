<script lang="ts">
	interface Props {
		title: string;
		lede?: string;
	}

	let { title, lede }: Props = $props();
</script>

<header class="section-header">
	<h2 class="section-header__title">{title}</h2>
	{#if lede}
		<p class="section-header__lede">{lede}</p>
	{/if}
</header>

<style>
	.section-header {
		border-top: 1px solid var(--line);
		padding-top: 1.5rem;
		margin-bottom: var(--space-block);
	}

	.section-header__title {
		font-size: var(--text-2xl);
		margin: 0;
	}

	.section-header__lede {
		margin: 0.75rem 0 0;
		color: var(--muted);
		max-width: 34rem;
	}
</style>
