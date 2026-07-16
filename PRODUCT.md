# Product

## Register

brand

## Platform

web

## Users

Primary: recruiters and HR people who got this link from a resume or LinkedIn. They skim on a work laptop, give it 30 seconds, and need a credible picture fast: real shipped work, real awards, a person who finishes things. Secondary: engineers and potential collaborators who click through from GitHub or a talk — they will actually hover the project windows, play the othello demo, and judge the craft.

## Product Purpose

Thanadol's personal portfolio at thanadolps.github.io. It replaces a 2019 student page. It exists to be a link worth putting on a resume (credibility in 30 seconds) and an information hub (every notable project reachable in ≤2 clicks, live demos playable in-place). Success: a recruiter comes away with "national champion, shipped hospital software solo, real backend chops" without scrolling past the first fold, and nobody mistakes the page for AI-generated filler.

## Positioning

A software engineer whose work holds up under inspection — schema-first backends, tested against real databases, plus a national-award game past. The page proves it by being inspectable itself: playable demos, honest placeholders, a colophon, no marketing voice.

## Conversion & proof

- Primary CTA: email (open inbox, not job-hunting) and resume PDF.
- Secondary: GitHub / LinkedIn / itch.io project links.
- The line a visitor remembers: "I like software that holds up under inspection."
- Belief ladder: (1) this is a real, current engineer, not a template → (2) the work is substantial (champion game, contract backend, solo hospital system) → (3) the person is careful and honest (constraints stated, placeholders labeled) → worth emailing.
- Proof on hand: Game Talent Showcase 2023 1st place + Talent of the Year + Best of Technology; published PINN paper (JNMA); shipped PTTEP contract backend; solo freelance triage system; playable othello-WASM and MALPI demos hosted on the page itself.

## Brand Personality

"The Quiet Workshop" — calm, precise, quietly playful. Three words: careful, honest, sly. Voice is first-person, plain, specific; numbers over adjectives; no exclamation marks. The one strange lovable detail is Rev, a pixel crab in the corner (Rust). Warmth comes from craft details you discover, never from the page shouting.

## Anti-references

- Generic AI-generated landing pages: purple gradient heroes, glassmorphism, neon-on-dark, three-icon feature grids, uniform fade-in-on-scroll.
- Stock portfolio voice: "passionate", "crafting digital experiences", "pixel-perfect", "let's build something amazing".
- "Open to work" desperation banners — he is employed and merely reachable.
- Over-templated dev-portfolio grammar: identical project cards, skill-percentage bars, tech-logo walls.

## Design Principles

1. Practice what you preach — the page itself is the proof of craft (inspectable, fast, accessible, honest).
2. Restraint with one strange lovable detail — WOW comes from discovery (crab, hover windows), never from flash.
3. Numbers over adjectives — every claim is concrete and verifiable.
4. Honest framing — placeholders labeled plainly, "co-authored" stays "co-authored", client names withheld and said so.
5. Content is data — every visible fact lives in typed data files, so updates are one object away.

## Accessibility & Inclusion

WCAG AA contrast throughout. Full keyboard path incl. hover windows (focus opens, Esc closes). `prefers-reduced-motion` honored everywhere (crab sits; windows open instantly). Mascot is `aria-hidden` and never intercepts clicks. Semantic landmarks, single h1, skip link, visible accent focus rings. Thai name rendered with proper `lang="th"`.

## Constraints (binding)

- Triage project: domain, stack, and role OK; never name the client, employer, or hospital.
- No Obsidian-vault content on the site. Resume PDF is maintained separately (out of scope here).
- Legacy URLs (`/MALPI/`, `/2nd_ODE_Solver/`, `/legacy/`, `/othello-wasm/`) must keep working.
