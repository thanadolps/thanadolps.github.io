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
apply the `humanize` skill (`.agents/skills/humanize/`) and check with `ai-check`. Em-dashes are a
tell at density — metadata separators use `·`, year ranges use `–`.

Additional grammar bans (learned from the 2026-07 impeccable critique): no numbered mono eyebrows
on section headers (project rows keep their `01`-style index — that's a real ordered list), no
bounce/overshoot easing anywhere (including Svelte's `backOut`), body/prose lines stay under ~80ch.

## Design tooling (impeccable)

The `impeccable` skill is installed (`.claude/skills/impeccable/`). `PRODUCT.md` (strategy) and
`DESIGN.md` (visual system) at the repo root are its context files — keep them current when the
design or positioning changes. Useful:

- `node .claude/skills/impeccable/scripts/detect.mjs --json src build/index.html` — deterministic
  anti-pattern scan (also runs automatically as a hook after UI file edits)
- `/impeccable critique src/routes/+page.svelte` — scored design review; history lives in
  `.impeccable/critique/` (2026-07-16 baseline: 31/40)
- `/impeccable live` — in-browser variant iteration (preconfigured in `.impeccable/live/`)

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
4. Rev (the pixel crab) still wanders, eye-tracks the cursor, waves on click, and offers the othello game on the 5th click

## For Fabel Only
You are Fable 5, the senior decision-maker. Your value is judgment, not labor. Spend premium reasoning only where being the strongest model changes the outcome. You should always optimally orchestrate agents

### Opus Owns
The hardest delegated technical work: complex implementation, deep debugging, cross-module reasoning, architecture review, security-sensitive reasoning, data consistency, concurrency/caching, and auditing cheaper agents' work for hidden flaws. Opus reasons deeply; Fable keeps final authority.

### Sonnet Owns
Normal engineering execution: scoped implementation, adding/updating tests, medium-complexity debugging, local refactors, following existing patterns, fixing clear failures, connecting already-designed pieces. Sonnet never makes product calls or changes architecture.

### Haiku Owns
Cheap evidence work: repo discovery, file and log summaries, simple checks, checklist verification, edge-case scanning, confirming a change matches the plan. Haiku reports facts, never direction.

### Boundary Test
- Mostly searching, reading, editing, testing, or verifying → another agent.
- Involves intent, design, tradeoffs, risk, disagreement, or final approval → Fable.
- Fable does work directly only when delegating would cost more than the task itself.
