---
target: homepage
total_score: 31
p0_count: 0
p1_count: 2
timestamp: 2026-07-16T10-41-23Z
slug: src-routes-page-svelte
---
# Critique — homepage (src/routes/+page.svelte)

Method: dual-agent (A: Opus design review · B: Sonnet detector/browser evidence)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | No active-section nav state; no visible Esc hint on focus-opened windows |
| 2 | Match System / Real World | 4 | n/a — plain language, legible window metaphor |
| 3 | User Control and Freedom | 3 | No stop/reset on running Playground demos |
| 4 | Consistency and Standards | 3 | Nav "Work" ≠ "Selected work"; "01" means both a section and a project |
| 5 | Error Prevention | 3 | No custom 404 (GitHub Pages default shows for bad URLs) |
| 6 | Recognition Rather Than Recall | 3 | Hover-window interaction unsignposted; most visitors never discover it |
| 7 | Flexibility and Efficiency | 3 | No mobile section nav at all below 640px; nav omits Honors/Craft |
| 8 | Aesthetic and Minimalist Design | 4 | n/a — the clear strength |
| 9 | Error Recovery | 2 | No custom 404, no noscript, no iframe-failure state |
| 10 | Help and Documentation | 3 | Colophon self-documents; no interaction hints |
| **Total** | | **31/40** | **Good** |

## Anti-Patterns Verdict

LLM assessment: mostly earned voice. Copy is the strongest anti-slop signal (specific, numeric, first-person). Scaffolding that remains: the `NN ·` mono-eyebrow on all six sections (the saturated editorial-portfolio grammar), uniformity of section treatment (everything weighted identically = "generated, not argued"), and a three-way "01" collision (hero hint / section 01 / project 01).

Deterministic scan: src → 1 finding (bounce-easing `--ease-spring`, tokens.css:50 — FALSE POSITIVE in effect: token defined but never consumed; delete it). built HTML → 2 findings: em-dash-overuse (17 in body text, real), numbered-section-markers 01–06 (real). Live overlay (injection succeeded): 4 line-length violations, ~94–133ch (target <80).

## Priority Issues

- [P1] Mobile navigation disappears below 640px with no replacement — pure-scroll only. Fix: minimal disclosure menu. (/impeccable adapt)
- [P1] Triage (flagship credibility per PRODUCT.md) is last, imageless, linkless — the belief-ladder keystone is the weakest-presented item. Fix: reorder and/or land the planned diagram. NOTE: current order was user-approved; reorder needs Thanadol's sign-off; diagram asset explicitly deferred by Thanadol (TODO(visual)).
- [P2] 3 of 5 project windows imageless → signature payoff misfires for most projects. Assets user-gated; interim fix: don't render them like empty states.
- [P2] Honors (national championship, published paper) unreachable from nav. Fix: add nav link.
- [P2] Numbered section grammar 01–06 + em-dash density are the remaining AI tells. Fix: drop section numbers (keep project numbering — a real sequence), thin em-dashes. (/impeccable quieter)
- [P3] No custom 404; no Esc hint; hero leaves a large dead gap on 390px screens; line lengths >80ch in wide sections. (/impeccable polish)

## Persona Red Flags

- Jordan (recruiter, 30s): hero delivers all three proof facts above the fold; but never discovers hover windows (no affordance), can't jump to awards, and Selected Work ends on its weakest-presented item.
- Sam (keyboard/SR): essentials solid (skip link, focus-opens-window, Esc restores focus). Rev and its Playground payoff are mouse-only; project-name buttons don't convey their purpose textually.
- Casey (mobile/3G): biggest loser — no section nav, desktop-only mascot delight, dead scroll gap after hero, facades give no load warning.

## Minor Observations

- Craft Shelf: 9 undifferentiated mono rows, no ranking signal.
- Nameless Maid at #03 ahead of contract work is arguable.
- imageAlt copy is thoughtfully voiced where present.
- Headless-Chrome full-page screenshot misreports dark theme (tooling quirk, not a site bug).

## Questions to Consider

1. If a recruiter never hovers and never meets Rev — the likely path — what is this page doing that a Markdown résumé isn't?
2. Is the asset pipeline (no screenshots allowed) silently dictating the narrative order instead of the content hierarchy?
3. Six sections, one identical header treatment: editorial decision, or decision deferred?
