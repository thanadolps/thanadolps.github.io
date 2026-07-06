import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	define: {
		// baked in at build time; shown as the footer "updated" stamp
		__BUILD_DATE__: JSON.stringify(
			new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
		)
	},
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Fully static, prerendered site served from a GitHub Pages user site at the domain root.
			adapter: adapter()
		})
	]
});
