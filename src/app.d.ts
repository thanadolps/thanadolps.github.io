// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	/** Build-time constant injected by vite.config.ts `define` (footer "updated" stamp). */
	const __BUILD_DATE__: string;
}

export {};
