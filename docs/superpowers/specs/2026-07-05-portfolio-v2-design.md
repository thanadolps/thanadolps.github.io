# Portfolio v2 — Design Spec

**Date:** 2026-07-05
**Owner:** Thanadol Chitthamlerd
**Direction:** "The Quiet Workshop" — calm editorial surface, deep machinery underneath. Craft you discover, not craft that shouts.

## 1. Goals & audience

- Primary: a link worth putting on a resume — recruiters/HR get a credible, skimmable picture in 30 seconds.
- Secondary: an information hub — every notable project reachable in ≤2 clicks, live demos playable in-place.
- Impression target: "WOW" through restraint + one strange lovable detail, never through flash. Must not read as generic AI-generated.
- Positioning: Software Engineer (SWE-first; game dev as strong color). Employed at SmarterTravel, open to offers but not actively seeking — no "open to work" banners.

## 2. Constraints & non-negotiables

- **Triage disclosure:** domain OK ("patient triage & records system for a Thai healthcare provider"), tech stack OK, role OK. **No client, employer, or hospital names.** No repo link (private).
- **Obsidian vault:** background understanding only — no vault content on the site.
- **AI-slop blocklist** (hard requirements, checked before ship):
  - No purple/indigo gradient heroes, no glassmorphism cards, no neon-on-dark "cyber" theme.
  - No emoji as section headers or bullet decoration.
  - No stock copy: "passionate", "crafting digital experiences", "turning ideas into reality", "pixel-perfect", "let's build something amazing".
  - No uniform fade-in-on-scroll on every element; no scroll-jacking.
  - No three-identical-column feature grid with icon circles.
  - Every line of user-facing copy passes the `humanize` skill; final sweep with `ai-check`.
- Old site code preserved (memory value): `legacy` branch on thanadolps.github.io; MALPI + 2nd_ODE_Solver URLs keep working (copied into `static/`).

## 3. Tech stack & repos

- **Framework:** SvelteKit (latest, Svelte 5 runes), TypeScript, scaffolded with `bunx sv create`. Bun as package manager/runtime.
- **Styling:** vanilla CSS with custom properties (design tokens) + PostCSS if needed. No Tailwind — token-driven handwritten CSS reads better for a bespoke editorial design and keeps the slop-pattern surface small.
- **Static output:** `@sveltejs/adapter-static`, prerendered; no server runtime.
- **Fonts (self-hosted via @fontsource, subset):** Fraunces (display/headings), IBM Plex Sans (body), IBM Plex Mono (labels, numbers, tech chips). System fallbacks for Thai glyphs.
- **Repo strategy:** this repo (`portfolio-v2`) is the source of truth. Deploy to `thanadolps.github.io` via GitHub Actions (Pages). Before first deploy: snapshot current `thanadolps.github.io` main as branch `legacy`.
- **URL preservation map:**
  - `/MALPI/**` and `/2nd_ODE_Solver/**` → copied verbatim into `static/`, so existing URLs survive.
  - `/othello-wasm/**` is a separate repo — untouched, embedded via same-origin iframe.
  - Old `index.html` → `static/legacy/index.html` (linked from footer as "the 2019 site").

## 4. Information architecture (single page + anchors)

Sticky minimal top nav (name · Projects · Playground · Experience · Contact · resume PDF). Sections:

1. **Hero** — typographic. Name large in Fraunces; role line: Software Engineer at SmarterTravel, Bangkok; one honest sentence of what he does (Go/Rust/TypeScript; systems-minded full-stack). Small Thai name rendering as a quiet sub-line. No photo, no gradient, no particle background. Mascot enters here.
2. **Featured projects** (5, in order):
   1. **Anachronic** — Unity; 1st place Game Talent Showcase 2023, "Talent of the Year" + "Best of Technology" → itch.io
   2. **PTTEP-BIF eDNA backend** — Go, Postgres, OpenAPI/sqlc schema-first, Testcontainers, JIT image resizing; contract, delivered 2024 → no link
   3. **The Nameless Maid** — Unity, 11-person team, Game Talent Showcase 2022 30-finalist → itch.io playtest
   4. **WigglePaw** — Next.js/tRPC, Omise payments, R2, CI, Cypress/Vitest → live-demo placeholder (resurrection planned) + GitHub
   5. **Triage** — SvelteKit/TS full-stack patient triage & records system for a Thai healthcare provider; solo freelance end-to-end delivery (requirements → hospital-system integration → mock services → Docker → handover) while employed full-time → no link, case-study framing
3. **Playground** — othello-wasm (Rust→WASM with AI) and MALPI (TF.js latent-space explorer) embedded, playable, lazy-loaded behind a click-to-run facade. Framed as "old experiments that still run."
4. **Craft shelf** — compact one-liner list: snss, community-archiver, leetcode_scaffold, Anki toolchain (lyricpcg, palette_100C, anki_utils — "publishing soon" placeholders; ties to Japanese learning/JLPT N4), raytracer, alt (toy language), bitboard_xo. Excluded by decision: pr-dash, rocket_anyhow, forks.
5. **Publications & awards strip** — one-liners: PINN paper (JNMA, "co-authored", link), Solar CC 3rd place, CP Academic Distinction (1st place HW Synthesis Lab), TraffyFondue top-5, SILLAPA gold 2017.
6. **Experience** — compact timeline: SmarterTravel (2024–), Triage freelance (2026), PTTEP contract (2023–24), TA Database Systems, OxygenAI internship (Go+PocketBase, TimescaleDB, ~5× throughput), B.E. CompEng Chula (GPAX 3.87).
7. **Contact footer** — GitHub, LinkedIn, Medium, email, resume PDF, link to the 2019 site. Quiet colophon ("built with SvelteKit; mascot is an othello disc").

## 5. Visual system (tokens)

- **Light:** paper `#F6F1E7`, ink `#1C1A16`, muted `#6B675E`, hairline `#E0D9C8`, accent (board green) `#2F6B4F`.
- **Dark:** charcoal `#1A1915`, warm text `#EDE7D9`, muted `#9B958A`, hairline `#2E2C26`, accent `#7FB894`.
- Theme: `prefers-color-scheme` + manual toggle persisted in localStorage.
- Subtle paper-grain texture (inline SVG noise, ~2–3% opacity, light mode only or tuned per theme).
- Type scale: display (Fraunces) for h1/h2 with tight leading; Plex Sans 16–18px body; Plex Mono for section numbers (`01`, `02`…), dates, tech chips.
- Layout: max-width ~68–72ch content column, generous vertical rhythm, hairline rules between sections. Numbered section headers, editorial style.
- Accent used sparingly: links, mascot-adjacent details, active states. Contrast: all text pairs pass WCAG AA (verify with tooling).

## 6. Signature interactions

### 6.1 Hover windows ("hoverflow")
- Desktop: hovering a featured-project row/card (after ~150ms intent delay) opens an OS-style mini window near the cursor/card: mono titlebar (`anachronic.exe` style naming — witty but restrained), traffic-light dots, screenshot, 2–3 line description, tech chips, links. Slight scale/translate spring on open; respects `prefers-reduced-motion` (instant, no spring).
- Keyboard: focus shows the same window; Esc closes.
- Touch/mobile: no hover — card taps expand inline (accordion) with same content. Window chrome kept as visual identity.
- Implementation: one `ProjectWindow.svelte` fed by typed project data; positioned with floating-ui-style logic (flip to stay in viewport).

### 6.2 Mascot — "Rev" the othello disc
- 20×20-ish pixel-art disc with tiny feet and blink-dot eyes. Rendered as DOM element with CSS `image-rendering: pixelated` sprite sheet (authored as SVG/PNG in repo).
- Behavior loop: idles/wanders along viewport bottom edge → notices cursor within radius, waddles toward it → click flips black↔white with a small hop → occasionally sleeps (zzz pixel puff).
- Payoff: after 5 flips, Rev sprints toward the Playground section (page scrolls gently if user follows) and a small speech bubble offers "play a real game?" linking to the embedded othello.
- Constraints: `aria-hidden`, never intercepts clicks outside its own hitbox, `prefers-reduced-motion` → Rev sits statically in a corner (still clickable to flip), disabled entirely below a perf floor (very low-end devices) — feature-detected, no user-visible toggle needed. Mobile: sits bottom-right, tap to flip.
- State machine implemented as a small standalone TS module (`src/lib/mascot/`) with unit-testable transitions; rendering layer separate.

### 6.3 Live demos
- Click-to-run facades (static screenshot + play button) that swap in same-origin iframes (`/othello-wasm/`, `/MALPI/index.html`). Nothing heavy loads before interaction. `loading="lazy"` as backup.

## 7. Copy guidelines

- First person, plain, specific. Numbers over adjectives ("~5× throughput", "3,000 students", "11-person team").
- Honest framing: paper is "co-authored"; Triage sold on ownership/delivery, not tech depth; placeholders labeled plainly ("coming back soon").
- Every section passes `humanize`; final `ai-check` sweep. No exclamation marks in body copy.

## 8. Accessibility & performance

- Semantic landmarks, single h1, skip-link, visible focus rings (accent color), keyboard path for all interactive content including hover windows.
- `prefers-reduced-motion` honored everywhere (mascot, windows, smooth scroll).
- Budgets: initial JS < 100KB gzip (mascot + windows are small vanilla-ish modules), LCP < 1.5s on Fast 3G-ish, fonts subset + `font-display: swap`, Lighthouse ≥ 95 across categories.
- OG meta + social card (paper-texture card with name + green disc), favicon = othello disc (flips via SVG in dark mode).

## 9. Maintainability

- **All content is data:** `src/lib/data/projects.ts`, `experience.ts`, `awards.ts` — typed (`Project` has `links: {kind, url, placeholder?}` so placeholders are first-class). Adding a project = one object + one optional screenshot.
- **AGENTS.md** at repo root: project conventions, design-token philosophy, slop blocklist, how to add/edit content, deploy notes.
- **Project skill** `.claude/skills/add-project/`: guided flow for adding a new project entry (prompts for links, picks tier, writes data + humanized copy).
- CI: `bun run check` (svelte-check) + build on PR; deploy on main.

## 10. Out of scope (future)

- Blog/writing section (Medium link suffices for now), i18n (TH/JA), OG-image automation, resurrected WigglePaw hosting, publishing the Anki tools (placeholders until then).

## 11. Acceptance checklist

- [ ] All Tier-1/2 content present with working or explicitly-placeholder links; Triage contains no names.
- [ ] Old URLs `/MALPI/*`, `/2nd_ODE_Solver/*` still serve; legacy branch pushed before first deploy.
- [ ] Rev: wander → follow → flip → payoff loop works; reduced-motion + mobile behavior correct.
- [ ] Hover windows keyboard-accessible; mobile inline expansion works.
- [ ] Slop blocklist audit + `ai-check` pass; copy through `humanize`.
- [ ] Lighthouse ≥ 95 ×4; WCAG AA contrast verified.
- [ ] AGENTS.md + add-project skill exist and reflect reality.
