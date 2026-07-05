<script lang="ts">
	let isDark = $state(false);

	$effect(() => {
		isDark = document.documentElement.dataset.theme === 'dark';
	});

	function toggle() {
		const next = isDark ? 'light' : 'dark';
		document.documentElement.dataset.theme = next;
		isDark = next === 'dark';
		try {
			localStorage.setItem('theme', next);
		} catch {
			// localStorage unavailable (private mode, etc.) — theme just won't persist.
		}
	}
</script>

<button
	type="button"
	class="theme-toggle"
	onclick={toggle}
	aria-pressed={isDark}
	aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
>
	{#if isDark}
		<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
			<circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" stroke-width="1.5" />
		</svg>
	{:else}
		<svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
			<circle cx="10" cy="10" r="7" fill="currentColor" />
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		padding: 0;
		border: 1px solid var(--line-strong);
		border-radius: 50%;
		background: transparent;
		color: var(--ink);
		cursor: pointer;
		transition:
			border-color var(--dur-fast) var(--ease-out),
			color var(--dur-fast) var(--ease-out);
	}

	.theme-toggle:hover {
		border-color: var(--accent);
		color: var(--accent);
	}
</style>
