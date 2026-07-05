/**
 * Cross-row coordination for the hover windows.
 * Only one project window may be open at a time across all FeaturedProject rows.
 * Reading `windowState.openId` in a component is reactive (Svelte 5 runes in a
 * `.svelte.ts` module); mutating the property notifies every reader.
 */
export const windowState = $state<{ openId: string | null }>({ openId: null });

/** Open the window for `id`, implicitly closing any other open window. */
export function openWindow(id: string) {
	windowState.openId = id;
}

/** Close `id`'s window, but only if it is the one currently open. */
export function closeWindow(id: string) {
	if (windowState.openId === id) windowState.openId = null;
}
