---
name: add-project
description: Add or update a project, craft-shelf tool, award, or experience entry on the portfolio site. Use when Thanadol says "add X to the site", "update the portfolio with Y", "publish Z on the craft shelf", or similar content changes.
---

# Add a project to the portfolio

All site content is typed data in `src/lib/data/`. Never write prose into components.
Read `AGENTS.md` first — the slop blocklist and Triage/client-name constraint are binding.

## 1. Gather facts (ask Thanadol only for what you cannot verify)

- What is it, one sentence, in his words?
- Links: live URL? repo? itch.io? crates.io? Check each with `curl -sI` — dead links become
  placeholder entries (`{ label, note }`, no `url`), never broken anchors.
- Numbers worth stating: team size, throughput gains, awards, dates. No number → no adjective in its place.
- Anything confidential? (client names, employer internals)
- Image available? Prefer og:image from the project's own page.

## 2. Pick the tier

- **Featured** (`projects.ts`): real-world delivery, award winner, or unusually deep work. Budget is
  5±1 rows — adding one usually means proposing a demotion to Thanadol.
- **Craft shelf** (`craft.ts`): small real tools, one-line blurb.
- **Playground** (`playground.ts`): only things that run in the browser, same-origin.
- Award/paper → `awards.ts`; job/education → `experience.ts`.

## 3. Write the entry

Follow existing entries' shape (`types.ts`). Copy voice: first person, plain, specific, honest;
run the `humanize` skill discipline over it (banned-word list included there); no exclamation
marks; placeholders labeled truthfully ("publishing soon", "no public link").

Window title convention for featured projects: filename + extension matching the dominant tech
(`triage.svelte`, `edna_backend.go`, `anachronic.exe`).

Images: convert to webp, ≤ 800px wide, ≤ 150KB, into `static/projects/`, with a real `imageAlt`.

## 4. Verify

- `bun run check && bun run build`
- Preview both themes; confirm the hover window and mobile accordion render the new entry sanely
- New external links get `rel="noopener"` automatically by the components — just confirm the URL is live
