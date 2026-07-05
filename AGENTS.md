# AGENTS.md — portfolio-v2

Personal portfolio of Thanadol Chitthamlerd, deployed to https://thanadolps.github.io.
Design direction: **"The Quiet Workshop"** — calm editorial paper-and-ink surface, personality in
discoverable machinery (hover windows, Rev the mascot, live WASM demos). Full rationale:
`docs/superpowers/specs/2026-07-05-portfolio-v2-design.md`. That spec is binding; this file is the
day-to-day digest.

## Stack

- SvelteKit 2 + Svelte 5 (runes: `$props()`, `$state`, `$derived`, `$effect`; events are `onclick=`, not `on:click`)
- TypeScript, `bun` for everything (`bun install`, `bun run dev`, `bun run check`, `bun run build`)
- `@sveltejs/adapter-static`, fully prerendered, no server runtime
- Fonts self-hosted via @fontsource: Fraunces (display), IBM Plex Sans (body), IBM Plex Mono (labels)

## Hard rules (the slop blocklist)

The design's whole bet is restraint. Never introduce:

- gradients, glassmorphism/backdrop blur, neon-on-dark, decorative shadows beyond `var(--shadow)`
- emoji in UI text (the mono `★` and `↗` glyphs are the only ornaments)
- uniform fade-in-on-scroll, scroll-jacking, parallax
- Tailwind or any CSS framework — tokens + handwritten CSS only
- hardcoded colors/sizes: every value comes from `src/lib/styles/tokens.css`
- marketing copy: "passionate", "crafting digital experiences", "pixel-perfect", exclamation marks

Copy voice: first person, plain, specific numbers over adjectives, no hedging, honest about
placeholders and limited roles ("co-authored", "my corner was the plumbing"). When writing new copy,
apply the `humanize` skill (`.agents/skills/humanize/`) and check with `ai-check`.

## Where things live

| Thing | Path |
|---|---|
| Design tokens (all colors/type/motion) | `src/lib/styles/tokens.css` |
| All content (typed data, no prose in components) | `src/lib/data/*.ts` |
| Page assembly | `src/routes/+page.svelte` |
| Sections | `src/lib/components/*.svelte` |
| Hover window (OS-chrome popup) | `ProjectWindow.svelte` + `FeaturedProject.svelte` |
| Rev the mascot (state machine is pure/testable) | `src/lib/mascot/` |
| Old 2019 site, preserved (URLs must keep working) | `static/MALPI/`, `static/2nd_ODE_Solver/`, `static/legacy/` |
| Resume PDF | `static/Resume_Thanadol_Chitthamlerd.pdf` |

## Adding / editing content

Use the `add-project` skill (`.claude/skills/add-project/`) or edit data files directly:

- Featured project → `src/lib/data/projects.ts` (order in array = order on page; earn a slot, 5±1 max)
- Small tool → `src/lib/data/craft.ts` (one-line blurb; links without `url` render as "publishing soon" placeholders — placeholders are a feature, keep them honest)
- Award/paper → `src/lib/data/awards.ts`; job → `experience.ts`; hero/contact copy → `site.ts`
- Images: `static/projects/`, webp preferred, ≤ 800px wide, ≤ 150KB

Constraint that overrides everything: **Triage and current-employer work may name the domain
("Thai healthcare provider") and stack but never client, hospital, or internal names.**

## Deploy

Push to `main` of `thanadolps/thanadolps.github.io` → GitHub Actions builds with bun and publishes
Pages. The pre-2026 site lives in the `legacy` branch of that repo — never delete it.
`/MALPI/*` and `/2nd_ODE_Solver/*` URLs are load-bearing (linked from old places); moving them is a
breaking change.

## Before you claim done

1. `bun run check` and `bun run build` pass
2. Page renders in both themes, 360px and 1440px, no horizontal scroll
3. New copy passes the slop blocklist above
4. Rev still wanders, flips on click, and offers the othello game on the 5th flip
