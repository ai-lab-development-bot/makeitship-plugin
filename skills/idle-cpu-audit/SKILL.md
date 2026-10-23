---
name: idle-cpu-audit
description: >
  Find and fix what keeps a web page's CPU busy while nobody touches it — infinite CSS
  animations, requestAnimationFrame loops, marquees and tickers, Lottie, autoplay video and
  video embeds, canvas / WebGL / 3D scenes, smooth-scroll libraries, GSAP, Webflow IX2 — for
  a whole site, one page or one block. Measures what each source costs on its own, proposes
  fixes (the ones a visitor cannot see first), keeps a plan-and-history file, and rolls fixes
  out in stages with before/after numbers. Use when asked about idle or background CPU, a
  page that heats the laptop or drains the battery, "main thread busy", heavy or laggy
  ambient animations, optimising background or decorative animation — and whenever you
  build or change a block with an ambient animation (landing pages, motion, visualisations):
  every such animation stops off screen, in a hidden tab and under reduced motion. Without
  the code it measures the live site and proposes tasks instead of fixing. Not for scroll
  smoothness, load speed (LCP) or bundle size.
---

# Idle CPU audit

A page at rest should not ask the browser for frames. While anything does — one spinner, one
marquee, one library ticker — the browser restyles, lays out and paints the **whole page** on
every display refresh, so a tiny animation on a long page costs as much as a full frame of that
page. This skill finds every such source, measures what each costs, proposes fixes, and works
through them in stages with before/after numbers.

Read `references/fix-catalog.md` before proposing fixes: it lists every kind of source, how to
recognise it, the fixes that work, and the traps. `references/plan-template.md` is the shape of
the plan file. `references/webflow-ix2-sleep.md` is the Webflow IX2 patch, for sites built in
Webflow.

## Who you are working for

The person is most likely the product owner, not an engineer. They know the site and what it
should feel like; they do not know what a render loop, a compositor or `requestAnimationFrame`
is, and they should never have to.

- **The measuring and the engineering are yours.** Which pages to measure, how, which fix
  removes a cost without changing anything a visitor sees: you decide, and you do not ask.
- **What a visitor would see differently is theirs.** When the remaining cost is in the design
  itself, the options reach them as propositions: what the visitor would see in each, the
  saving, your recommendation and why. Never "pause the rAF loop or cap it at 30 fps?".
- **Numbers in their words.** In the chat, "how busy the page keeps the computer while nobody
  touches it" — the laptop warms, the battery drains, other tabs slow down — not "main thread
  busy" or "rAF/s". The engineering columns stay in the plan file for whoever builds it.
- **Facts only they hold are asked once, in product words, with the reason**: the address of
  the site when there is no local build, a login when pages are behind one, which pages matter
  most when the site is large and nothing else says so. One message, not a drip.

## 0. Scope and setup

Three scopes; take it from the request:

- **Site** — every page type.
- **Page** — a URL or route.
- **Block** — a selector, a component, or "the hero on /pricing": find the selector yourself.

**With the code** (you are in the project): measure a **local build** or dev server, not
production — CDN caching, analytics and consent banners add noise. Read the project's own rules
(AGENTS.md, CLAUDE.md, README); they win over this skill on branches, commits, releases and file
layout.

**Without the code** (only the site's address): measure the live site, say once that live numbers
are noisier than a local build's, and fix nothing — there is nothing to fix in. The outcome is
the findings and, for the ones worth doing, tasks (Section 2).

**Analysis changes nothing.** No project code is edited until the plan is agreed.

**The scripts** are in the `scripts/` folder next to this file, wherever the skill is installed.
They need Node 18+ and `playwright-core`; when `scripts/node_modules` is missing (a first run, or
a plugin update that replaced the folder), run `npm install` there yourself — it touches nothing
in the project — and never ask the person to. They drive the installed Google Chrome, or
Playwright's Chromium if there is none (`npx playwright-core install chromium`), **headed, off
screen to the right** (`IDLE_CPU_WINDOW_POS`, default `4000,0`): headless Chrome gives wrong frame
rates and CPU. If the window still shows up on the person's screen, move it further right.

| Script | What it answers |
| --- | --- |
| `pages.cjs <sitemap> \| --dir <build>` | page types and how many pages each has (site scope) |
| `audit.cjs <url> [--selector css]` | inventory of every ambient source, load at top / bottom (or block on screen / away), what still runs off screen |
| `idle-cpu.cjs <url> [--block re] [--css …] [--pause re] [--scroll-through] [--runs 3]` | main-thread busy %, rAF/s and timers by source; ablation of one source |
| `style-writes.cjs <url>` | which elements JS keeps rewriting at rest (IX2, GSAP, Lottie, counters) |

## 1. Find

1. **Site scope:** run `pages.cjs` and pick one or two representative pages per page type (the
   type's template, plus a variant that carries the most media). Small one-off pages that share
   a layout can share a row. Weight every finding by how many pages it affects.
2. **Read the code** (when you have it) for sources a runtime scan can miss — lazy-initialised,
   behind a breakpoint, on interaction: `grep -rnE` for `infinite`, `requestAnimationFrame`,
   `setInterval`, `autoplay`, `loop`, `lottie|bodymovin`, `Splide|AutoScroll|Swiper`,
   `gsap|ScrollTrigger|repeat:\s*-1`, `Lenis|locomotive`, `THREE|WebGL|getContext\(`, `spline`,
   `Webflow|ix2`. Note the file and which pages load it.
3. **Run `audit.cjs`** on each representative page (block scope: with `--selector`) at 1440 px,
   and at 375 px where the mobile layout differs. Run `style-writes.cjs` when rAF is high but the
   inventory does not explain it.
4. **Measure the baseline** with `idle-cpu.cjs --runs 3` (median), at the top and with
   `--scroll-through`.
5. **Attribute load per problem** by ablation: the same run with that one source disabled
   (`--block <its script>`, `--pause <animation name>`, `--css` to hide or pause it). The saving
   is that problem's "load alone". Say plainly that these do not add up — the page reaches its
   floor only when every always-on source is gone.

**Measurement rules**: same viewport, settle and duration for every before/after pair; median of
3; differences under ~2 points are noise; record the Chrome version and conditions in the plan
file.

## 2. Report and propose

Show the person a **findings table** in the chat, in their words, sorted by impact (load ×
pages): what keeps moving and where a visitor would meet it, on how many pages, what it costs
on its own, whether it keeps running when nobody can see it, and the proposed fix with what the
visitor would see differently. The engineering detail (library, file, rAF/s) goes into the plan
file, not the chat.

**Options rule.** Only effective fixes; never a weak one offered for the sake of choice.

- If a fix changes nothing the visitor sees or can do, it is **the only option**, and it is
  yours: state it, do not ask (a smooth-scroll loop that runs only while scrolling; a ticker
  that sleeps; a marquee that pauses off screen).
- If the remaining cost is in the design itself, **two, at most three** options, most effective
  first, each saying what the visitor will see differently and the expected saving, one of them
  **Recommended** with its reason. Option A is always the no-visual-change part; B adds the
  visible change. Example — a hero particle field: A — stops off screen and in a hidden tab; B —
  A, plus it moves for 10 s and then holds still, redrawing only for the cursor.

**Default, always:** every ambient animation stops off screen, in a hidden tab, and stays still
under reduced motion — through **one shared helper** (`runWhileVisible`, in the catalog), not one
observer per file. It is part of every option, not an option. It also applies to any animation
added later: when you build or change a block with one, include it without being asked.

**Without the code**, the findings end in a proposal of tasks: one per fix worth doing (or one
per page type for a large fix), each written for whoever has the code — what keeps moving,
where, what it costs, the agreed fix and what the visitor would see. Offer to create them; on a
yes, use the `create-task` skill in this plugin, which writes and files them. Without the
makeitship server connected, give the person the task texts instead.

## 3. Plan file (with the code)

Once the person has seen the findings and taken the visible-change decisions, create the plan
file from `references/plan-template.md` — in the project's docs folder if it has one
(`docs/idle-cpu-plan.md`), else the root (`IDLE-CPU-PLAN.md`). It is a temporary working log:
findings, decisions, stages, and a history of every fix with before/after numbers. If the
project keeps a changelog or backlog, link the plan from there rather than copying it.

**Stages.** Invisible, high-impact, low-risk fixes first; slow or risky ones last. Split a large
fix into sub-stages, usually by **page type** (or by component), each verified and released
before the next — e.g. a runtime patch enabled behind an opt-in attribute per template. One
stage = one reviewable change. Each stage lists what must still work and where.

Show the person the stages in a few lines, in their words — what changes for whom, in which
order — and start when they say so.

## 4. Fix, one stage at a time

1. Follow the project's branch rules.
2. Implement the stage. Reuse the shared helper; keep fixes in the shared code that owns the
   animation, not per page.
3. **Verify behaviour, not just numbers** — a fix that saves CPU and breaks a menu is not done:
   - the animation still runs on screen, stops off screen, resumes on return (and in the same
     state, not restarted, unless restarting was the design);
   - hidden tab and reduced motion;
   - interactions on that block (hover, click, sliders, menus, modals; videos the visitor paused
     stay paused);
   - for runtime patches (IX2, smooth scroll): a style diff of inline styles after each scroll
     step and hover, patched vs unpatched (twice unpatched to subtract noise), and a timing
     check that animations started after a quiet period still play rather than jump to the
     end;
   - breakpoints: resize across them;
   - console errors.
4. **Measure again** under the same conditions; write before → after into the plan's history and
   the stage table. Report to the person in a short table, in their words.
5. Commit, push and release only as the project and the person allow; a release to production
   is its own request.

## 5. Close

When the stages are done: a final pass of `audit.cjs` on every page type, the before/after
summary table in the plan file, and a proposal for the file — recommended: fold its summary into
the project's changelog or backlog when it has one and delete the file, otherwise keep it in the
docs; the person confirms. A cost left on purpose (a design the person chose to keep) is named
in that summary, with what it costs and where. If the project has agent rules (AGENTS.md,
CLAUDE.md), propose adding the default rule — "an ambient animation never runs off screen; use
the shared helper" — so future work keeps it.

## Red flags

| Thought or draft | Reality |
|---|---|
| "I'll optimise what looks heavy in the code" | Measure first; attribute by ablation. A guess fixes the wrong thing. |
| Asking the person how to implement an invisible fix | Yours. They decide only what a visitor would see. |
| "main thread busy 43%, rAF 180/s" in the chat | Their words: how busy the page keeps the computer at rest. The numbers go to the plan file. |
| Summing per-source savings into a total | They do not add up; say so next to the table. |
| A weak option offered for the sake of choice | Only effective fixes; the invisible one alone when it suffices. |
| One IntersectionObserver per file | One shared helper per project. |
| A new block with an ambient animation, without the helper | It stops off screen, hidden and under reduced motion — always, unasked. |
| Saved CPU, broken menu | Not done. Verify behaviour on every stage. |
| Editing code during the analysis | Analysis changes nothing until the plan is agreed. |
| Fixing the live site without the code | Without the code the outcome is findings and tasks. |
| Asking the person to run `npm install` | Run it yourself in `scripts/`. |
| Headless Chrome for the numbers | Headed, off screen; headless lies about frames and CPU. |
