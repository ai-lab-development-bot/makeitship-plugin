---
name: page-speed-audit
description: >
  Find and fix what makes a web page load slowly — a low PageSpeed Insights or Lighthouse
  score, poor Core Web Vitals (LCP, INP, CLS), a slow first screen on mobile — for a whole
  site, one page or one element. Measures with the PageSpeed Insights API (the lab) and
  the Chrome UX Report API (real visitors), finds the causes — render-blocking CSS and
  fonts, the LCP element, JavaScript, third parties, images, layout shift, the server —
  and heavy elements (3D / WebGL / three.js scenes, Spline, canvas, video, Lottie, maps,
  widgets) that should start only where the device can carry them, then fixes the ones a
  visitor cannot see first, with before/after numbers. Use when asked about page speed,
  the PageSpeed or Lighthouse score, Core Web Vitals, "the site is slow on mobile", or
  when a page with a heavy hero element is built. Without the code it measures and
  proposes tasks. Not for what keeps the CPU busy after the page has loaded — that is
  `idle-cpu-audit`.
---

# Page speed audit

A page is judged by how fast its first screen appears and responds — on a mid-range phone on a
slow network, which is what PageSpeed's mobile run imitates. This skill measures that, finds what
holds it back, fixes it in order of impact, and proves each fix with numbers.

Read `references/pagespeed-api.md` before the first measurement (the two APIs, the key, how to
run them), `references/fix-catalog.md` before proposing fixes, and
`references/heavy-elements.md` whenever a 3D scene, a WebGL or canvas effect, a video, a Lottie,
a map or a widget is in the first screen or among the costs.

## Who you are working for

The person is most likely the product owner, not an engineer. They see a score and a site that
feels slow; they do not know what LCP, a render-blocking resource or hydration is, and they
should never have to.

- **The measuring and the engineering are yours.** Which pages, how many runs, which fix, in
  which order: you decide, and you do not ask.
- **What a visitor would see differently is theirs.** A static image instead of the 3D scene on
  phones, a font that appears a moment later, a hero that no longer fades in: each reaches them
  as a proposition — what the visitor would see, the expected gain, your recommendation and why.
- **Numbers in their words.** "The first screen appears after 4.1 seconds on a phone; good is
  under 2.5" — not "LCP 4.1 s". Always say which number is which: the **PageSpeed score** is one
  test run on Google's servers, the **real-visitor numbers** are what people actually got over the
  last 28 days, and only the second is what Google Search uses. A high score with poor
  real-visitor numbers is not a fast site.
- **Facts only they hold are asked once, in product words, with the reason**: the site's address
  (or a preview address) when there is none in the project, a Google API key
  (`references/pagespeed-api.md` has the message and the steps), a login when pages are behind
  one. One message.

## The rule that is never bent

**Fix the page, never the measurement.** Nothing in this skill recognises PageSpeed, Lighthouse,
headless Chrome or Googlebot — no user-agent checks, no IP lists, no "skip it for the test".
Serving search crawlers something else than visitors get is cloaking; serving the measuring tool
something else makes the score a lie the person will act on. What the skill does instead is
progressive enhancement: decide by what the device can do (`references/heavy-elements.md`), so
every visitor whose device would struggle gets the light version too.

## 0. Scope and setup

- **Site** — every page type (group pages by template; one or two representative pages per type,
  weighted by how many pages share it). **Page** — a URL. **Element** — "the hero 3D on the home
  page": find it yourself.
- **The key.** Look for one first (`.psi-api-key`, `PSI_API_KEY`). Without one, ask for it once
  with the reason; meanwhile measure what the shared quota allows and say the numbers are thin.
- **A public URL.** PageSpeed measures only addresses reachable from the internet: production, a
  preview deployment, or a tunnel to a local build — use what the project already has. Local
  Lighthouse is a fallback for when nothing public exists, with the caveats in
  `references/pagespeed-api.md`.
- **With the code**, you fix. **Without the code** (only the address), you measure, find and
  propose tasks (Section 3); nothing is fixed.
- **Analysis changes nothing.** No code is edited while you measure: the baseline is the page as
  it is.

The scripts are in `scripts/` next to this file. They need Node 18+ and no installation.

| Script | What it answers |
| --- | --- |
| `psi.cjs <url> [--strategy both] [--runs 3] [--raw <file>]` | lab: median score and metrics per form factor, the LCP element, the failing audits sorted by what they would save |
| `psi.cjs --lighthouse <report.json> …` | the same summary for local Lighthouse reports |
| `crux.cjs <url> [--origin]` | field: p75 LCP, INP, CLS, FCP, TTFB for phones and desktops, page and origin |

## 1. Measure the baseline

1. `crux.cjs` for each representative page: the real-visitor picture, and whether there is one
   (a new or small site often has data only for the origin, or none).
2. `psi.cjs --runs 3` for mobile and desktop on each representative page. Keep `--raw` for the
   page you will work on first: the main-thread breakdown by script and the request chain are in
   it.
3. Note the conditions next to the numbers: the URL kind (production, preview, tunnel), the date,
   the Lighthouse version, the spread.

## 2. Find the causes

Work from the worst metric and from `lcpElement`, using `references/fix-catalog.md`:

- **The first screen**: what the LCP element is, what it waits for (server, a render-blocking
  stylesheet or font, a script, its own download), and whether a heavy element sits in it.
- **The main thread**: which scripts cost the most at startup (`bootup-time` in the raw result),
  which of them the first screen needs, which third parties load early.
- **Layout shift**: which elements move, and why.
- **Read the code** (when you have it) for what the runtime result points at: how the hero is
  built, how styles and fonts are loaded, where scripts are included, what a heavy element
  imports and when.

For each cause, estimate the gain from the audit's `savings` and from what you saw; the real gain
is measured after the fix.

## 3. Report and propose

Show the person a **findings table** in the chat, in their words, sorted by expected gain: what
holds the page back and where a visitor meets it, on which pages, the expected gain, and the
proposed fix with what the visitor would see differently. Lab and real-visitor numbers in
separate columns. The engineering detail (audit ids, scripts, sizes) stays in your notes and in
the commits.

**Options rule.** Only effective fixes; never a weak one offered for the sake of choice.

- A fix that changes nothing a visitor sees is **the only option, and yours**: state it, do not
  ask (a deferred stylesheet, a preloaded font, a deferred script, a gated heavy element whose
  light version is what that device already got).
- Where the gain needs a visible change, **two, at most three** options, the no-visible-change
  part first, one **Recommended** with its reason. Example — a 3D hero: A — it starts only where
  the device has a real GPU, with the static mark painted from the first frame (visitors with a
  GPU see no difference); B — A, plus phones always get the static mark.

The table is a report, not a gate: when no finding needs their decision, carry on into the
fixes.

**Without the code**, the findings end in a proposal of tasks: one per fix worth doing, each
written for whoever has the code — what holds the page back, where, the measured numbers, the
agreed fix and what the visitor would see. Offer to create them; on a yes, use the `create-task`
skill in this plugin. Without the makeitship server connected, give the person the task texts.

## 4. Fix, in order of gain

1. The fixes that need no decision first, biggest gain first; then the agreed visible ones. One
   reviewable change per cause; a fix in shared code (the layout, the head, the build) rather than
   per page.
2. **Verify behaviour, not just numbers** — a faster page with a broken menu is not done: the
   first screen looks as agreed on desktop and on a phone, in both themes if there are two;
   fonts, images and interactive parts work; a gated heavy element starts where it should and
   stays light where it should (`references/heavy-elements.md`, *Verifying*); no layout shift; no
   console errors.
3. **Measure again** on the same kind of URL, three runs per form factor; report before → after
   in a short table, in their words. A change inside the spread is not a gain.
4. Document what the change established — how the first screen loads, the heavy-element gate —
   with the `document-implementation` skill in this plugin.
5. Commit, push and release only as the project and the person allow; a release to production is
   its own request.

## 5. Close

A final `psi.cjs` pass on every representative page, then the closing report: before → after per
page type and form factor, what was left on purpose (a heavy element the person chose to keep
everywhere, a third party that must load early) with what it costs, and the real-visitor numbers
as they are today with the note that they follow over the next 28 days.

## Red flags

| Thought or draft | Reality |
|---|---|
| "If the user agent is Lighthouse or Googlebot, skip the 3D" | Never. Gate by what the device can do; recognising the tool is cloaking and a false score. |
| "The score is 99, the site is fast" | One lab run. Report the real-visitor numbers next to it. |
| A single PageSpeed run as before/after | Median of three; inside the spread is noise. |
| Measuring the baseline in production and the fix in local Lighthouse | Same kind of URL for both, or the comparison means nothing. |
| `loading="lazy"` on the LCP image | Never; it is the one image that must load first. |
| Preloading every font and image | Only what the first screen paints; preloads compete with LCP. |
| A WebGL gate inside the already-loaded scene component | It saves the main thread but not the download; probe before importing. |
| Asking the person which fix to implement when none is visible | Yours. They decide only what a visitor would see. |
| "LCP 4.1 s, TBT 900 ms" in the chat | Their words: when the first screen appears, how long the page ignores a tap. |
| The API key in a commit, a task or the chat | Local file, gitignored; never printed. |
| Fixing the live site without the code | Without the code the outcome is findings and tasks. |
| Asking for a "start" when no finding needs their decision | Carry on. |
