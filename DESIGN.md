# Design — The Quiet Workshop

Paper-and-ink editorial with one strange lovable detail. Calm surface, deep machinery underneath: craft you discover (hover windows, a pixel crab, playable demos), never craft that shouts. This system is a **committed shipped identity** — refine within it; do not swap fonts, palette, or lane.

## Theme

Dual theme. Light "paper" is the default presentation; dark "charcoal" via `prefers-color-scheme` plus a manual toggle persisted in `localStorage` (`data-theme` on `<html>`, set pre-paint in `app.html`). A fixed-position SVG fractal-noise grain overlays everything at 3–4% opacity.

## Color

All tokens in `src/lib/styles/tokens.css`. Strategy: restrained — tinted warm neutrals plus one accent used sparingly (links, focus, active states, proof strip). The crab gets its own tertiary terracotta so it never competes with the accent.

| Role | Light | Dark |
|---|---|---|
| `--paper` (bg) | `#f6f1e7` | `#191813` |
| `--paper-raised` (windows/cards) | `#fdfbf5` | `#211f19` |
| `--ink` (text) | `#1c1a16` | `#ede7d9` |
| `--muted` (secondary text) | `#6b675e` | `#9b958a` |
| `--line` / `--line-strong` (hairlines) | `#e0d9c8` / `#c9c0aa` | `#2e2c26` / `#45423a` |
| `--accent` (othello-board green) | `#2f6b4f` | `#7fb894` |
| `--accent-soft` (chip/hover wash) | `#e4ece5` | `#24352b` |
| `--mascot` / `--mascot-deep` (Rev) | `#a85b38` / `#7e4128` | `#c97a54` / `#9c5a3c` |

Rules: text pairs must hold WCAG AA (muted-on-paper included). No gradients, no glass blur, no neon — hard ban, see AGENTS.md.

## Typography

- Display: **Fraunces Variable** (h1–h3; hero uses `font-variation-settings: 'opsz' 40`).
- Body: **IBM Plex Sans** 400/500, 17px base, line-height 1.65.
- Labels/numbers/chips: **IBM Plex Mono** 400/500 via the `.mono` utility.
- Scale (tokens): xs .75rem · sm .875rem · base 1.0625rem · lg 1.1875rem · xl 1.5rem · title clamp(1.5–1.85rem) · 2xl clamp(1.6–2.2rem) · hero clamp(2.6–4.4rem).
- Self-hosted via @fontsource; system fallbacks cover Thai glyphs (`lang="th"` on Thai text).

## Layout

Single page, anchored sections. Body column `--content-width: 44rem` (~70ch); featured rows and playground use `--wide-width: 58rem`. Vertical rhythm between sections: `--space-section: clamp(5rem, 12vh, 8rem)`. Hairline rules and a section-header system (`SectionHeader.svelte`) separate sections. Radii: 6px general, 8px for OS-window chrome.

## Motion

- Tokens: `--ease-out: cubic-bezier(0.2, 0.7, 0.3, 1)`, `--dur-fast: 140ms`, `--dur-med: 240ms`.
- Hero: single fade-up on load. No uniform scroll-reveal anywhere — hard ban.
- Hover windows: small scale/translate on open, `--dur-med`.
- Rev the crab runs on rAF with its own state machine (`src/lib/mascot/`).
- Every animation has a `prefers-reduced-motion` alternative (crab sits but eyes still track; windows open instantly; no smooth scroll).

## Components

- `Nav` — sticky minimal top bar: name, section links, resume PDF, `ThemeToggle`.
- `Hero` — typographic only: kicker, Fraunces name, Thai sub-line, role line, intro, accent mono proof strip, scroll hint. No photo, no background art.
- `FeaturedProject` + `ProjectWindow` — hover/focus opens an OS-style mini window (mono titlebar like `anachronic.exe`, traffic-light dots, shot, blurb, tech chips, links). Touch gets an inline accordion. One window open at a time (`featured-state.svelte.ts`).
- `DemoFacade` — click-to-run facade before any iframe loads (othello-wasm, MALPI).
- `CraftShelf` — compact one-liner list of small tools.
- `Honors`, `ExperienceTimeline`, `Footer` (colophon + build stamp `__BUILD_DATE__`).
- `Rev.svelte` — 32×28 pixel crab, `aria-hidden`, eye-tracking pupils, click to wave, 5 clicks → sprints to Playground.

## Voice & copy

First person, plain, specific; numbers over adjectives; no exclamation marks; placeholders labeled plainly. All copy passes the `humanize` skill and an `ai-check` sweep (`.agents/skills/`).

## Performance budget

Initial JS < 100KB gzip, LCP < 1.5s, Lighthouse ≥ 95 ×4, fonts subset with `font-display: swap`, demos lazy behind facades.
