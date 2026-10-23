# Idle CPU plan — <site or page>

<!-- Created by the idle-cpu-audit skill on <date>. This file is the working log of the
     optimisation: the findings, the plan, every fix and every measurement before and after.
     Keep it current with each fix; when the plan is closed, ask the user whether to keep it,
     fold its summary into the project's changelog/backlog, or delete it. -->

**Scope:** whole site | page `<url>` | block `<selector>` on `<url>`
**Branch:** `<branch>` · **Measured on:** local build `<url>` · Chrome <version>, headed,
viewport 1440×813 (and 375×812 where noted) · settle 6 s · rest 15 s · median of 3 runs.
**Status:** <one line: what is done, what is next>

## Baseline

| Page (type, pages) | Idle at top | Idle after scrolling | rAF/s at rest | Main sources |
| --- | --- | --- | --- | --- |
| `/` (home, 1) | <n>% | <n>% | <n> | <sources> |

## Findings

Load per problem is measured **alone** (that source disabled, everything else as is), so the rows
do not add up: a page drops to its floor only once every always-on source is gone.

| # | Problem | Where (pages) | Built with | Load alone | Off screen? | Fix options | Visual change | Stage |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Logo strip keeps moving off screen | <type> (<n> pages) | <library> | −<n>% | runs | A: only while visible | none | 1 |
| 2 | Hero animation redraws forever | home | canvas rAF | −<n>% | runs | A: only while visible · B: A + still after 10 s | B: motion stops after 10 s | 2 |

### 1. <Problem>
- **What and where:** file, selector, pages.
- **Measured:** load alone, rAF/s, on screen vs off screen.
- **Options:** A — … (no visual change). B — … (what the visitor sees differently).
- **Decision:** <the user's choice, date>

## Plan

Order: invisible high-impact fixes first, risky or slow ones last; a large fix is split into
sub-stages (by page type, by component). One stage = one reviewable change.

| Stage | What | Pages | Risk | Status |
| --- | --- | --- | --- | --- |
| 1 | Marquees and tickers only while visible | all | low | open |
| 5a | <runtime patch> — <page type> | <n> | high | open |

### Stage 1. <name>
- **Change:** files, what exactly.
- **Must still work:** behaviours to check, and on which pages.
- **Before → after:** table filled in when done.

## History

Newest first. Each entry: date, stage, commit, what changed, before → after numbers, what was
verified, anything surprising.

- **<date> — stage 1, `<commit>`.** … Idle at top: <page> <n>% → <n>%, <page> <n>% → <n>%.
  Verified: <behaviours checked — e.g. strips run on screen, stand still off screen, resume on
  return; still under reduced motion>.
