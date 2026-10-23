# Fix catalog: sources of idle CPU and how to fix them

Every entry: how to recognise it, the fix that changes nothing for the visitor (always offered
first), and — only where the design itself is the cost — the fix that changes what is seen.
Where numbers appear they show an order of magnitude, not a promise; measure every fix.

## Why one small loop is expensive

While anything requests frames — a CSS `infinite` animation that repaints, a
`requestAnimationFrame` loop, a library ticker — the browser runs style, layout and paint for the
whole page on every display refresh (60–170 Hz). The cost scales with the **page**, not the
animation: a 20 px spinner on a long page costs a full frame of that page. Two consequences:

- **Per-source numbers do not add up.** Removing one of four always-on loops often saves almost
  nothing; the page drops only when the last one stops. Report per-source savings measured
  *alone* (ablation) and say this next to the table.
- **Compositor-only animations are cheap but not free.** `transform`/`opacity` on their own layer
  skip main-thread paint, but still wake the compositor; off screen they must stop anyway.

## The default: run only while visible

Applies to **every** ambient animation, with no visual change, so it is never a choice the user
has to make. It stops when the block is off screen, when the tab is hidden, and never starts under
`prefers-reduced-motion: reduce`. Use **one shared helper** per project, never one observer per
file. If the project has none, add this (adapt naming to the project):

```js
// Calls start() when el comes within `margin` of the viewport and stop() when it leaves it or the
// tab is hidden. Under reduced motion calls stop() once and never starts.
window.runWhileVisible = function (el, start, stop, { margin = '100px' } = {}) {
  if (!el) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { stop(); return; }
  let inView = false, running = false;
  const sync = () => {
    const want = inView && !document.hidden;
    if (want && !running) { running = true; start(); }
    else if (!want && running) { running = false; stop(); }
  };
  new IntersectionObserver((es) => { inView = es[es.length - 1].isIntersecting; sync(); }, { rootMargin: margin }).observe(el);
  document.addEventListener('visibilitychange', sync);
};
```

For CSS-only animations the same helper toggles a class:
`.is--paused, .is--paused * { animation-play-state: paused !important; }`.

**Watch the right element.** An element hidden by `clip-path`, `opacity: 0` reveal, or a
transformed parent can report "not intersecting" while on screen; observe its visible wrapper.

## Sources, by kind

### CSS `infinite` animations (spinners, wheels, glows, pulses, gradients, marquees)
- Recognise: `audit.cjs` → `inventory.anims`, `compositorOnly: false` means it repaints.
- No-visual-change fixes: run only while visible (class toggle). If it animates a repainting
  property (gradient angle via `@property`, `background-position`, `filter`, `box-shadow`, size,
  `clip-path`) — **same look, cheaper**: move the motion to `transform`/`opacity` of a layer
  (a rotating gradient = a rotated, clipped pseudo-element; a moving background = a translated
  child). Verify pixels side by side; this one is only "invisible" if the screenshots match.
- Trap: a **percentage `translate` inside keyframes** keeps the animation on the main thread in
  Chrome; centre with margins and animate fixed units.

### JavaScript `requestAnimationFrame` loops (canvas effects, custom cursors, parallax, counters)
- Recognise: `rafPerSec` by file in `idle-cpu.cjs` / `audit.cjs`.
- No-visual-change: **end the loop when it has nothing to change; restart it from the event that
  changes something** (scroll, pointer, resize, visibility). A loop that keeps calling rAF and
  merely skips drawing still costs a full frame — the check must stop the loop, not the draw.
  Plus run only while visible.
- Visual-change option (offer as 2nd): play for N seconds, then hold still and react only to the
  visitor (a hero particle field: moves for 10 s, then redraws only for the cursor). Or a frame-rate
  cap (30 fps) where the eye cannot tell — measure that it actually saves.

### Smooth-scroll libraries (Lenis, Locomotive, GSAP ScrollSmoother)
- Recognise: their rAF at 60/s at rest.
- No-visual-change: drive them from a loop that runs only while scrolling is in progress
  (start on `wheel`/`touch`/`keydown`/`scroll`/anchor click, stop when the library reports it is
  idle). Lenis: `autoRaf: false`, own loop that stops when `!lenis.isScrolling` and velocity is 0.

### GSAP
- Recognise: `libs.gsap.tickerListeners`, `infiniteTweens`; ScrollTrigger is idle-cheap by itself.
- `repeat: -1` tweens → pause/resume with the visibility helper (`tween.pause()` / `.play()`).
- The ticker sleeps on its own when nothing is active (`gsap.ticker` auto-sleeps); something
  `ticker.add`-ed that never removes itself keeps it awake — find and gate it.

### Marquees and tickers (Splide AutoScroll, Swiper autoplay `delay: 0`, CSS strips, custom)
- No-visual-change: run only while visible. Splide AutoScroll: `autoStart: false`, `play()` from
  `start`, `pause()` from `stop` (with `autoStart: true` it starts itself on window `load`, even off
  screen). Swiper: `autoplay.start()` / `.stop()`; `stop()` lets the current transition finish, so
  a slow ticker keeps moving up to `speed` ms after it leaves — expected.
- Trap: **two scripts mounting the same marquee** (two loops on one strip). Check for a second
  initialisation before optimising one.

### Lottie
- Recognise: `inventory.lottie` with `loop: true, paused: false`; `style-writes.cjs` shows SVG
  attribute writes per frame.
- No-visual-change: pause/play with the visibility helper (`anim.pause()` / `anim.play()`).
- Visual-change options: play once on load and again on hover/interaction (`loop: false` plus a
  replay on `mouseenter`); or play only on interaction.
- Webflow Lottie inside IX2 (`data-animation-type="lottie"` driven by an IX2 event with `loop`):
  the loop lives in the IX2 event, so `loop: false` goes on that event in the Webflow runtime
  file, and the replay is a small script.

### `<video autoplay loop>` and video iframes (Vimeo, YouTube, Wistia)
- Recognise: `inventory.videos` / `inventory.iframes`; `offscreenAt…` lists ones playing away.
- No-visual-change, two parts:
  1. **Load near the screen**: move `src` to `data-src` (at build time where possible) and set
     `src` when within ~1 screen. On a page with many players the first-load saving is often
     tens of megabytes.
  2. **Pause off screen**: `<video>` → `pause()`/`play()` via the helper, and do not resume one the
     visitor paused. Vimeo → one `Vimeo.Player` per iframe; also pause a player whose autoplay
     *starts* after it left the screen.
- Do not query dozens of players through the Vimeo API at once — a test script doing that crashed
  the renderer; the page itself did not.

### Canvas / WebGL / three.js / Spline / PixiJS
- No-visual-change: stop the render loop off screen (`renderer.setAnimationLoop(null)`, cancel the
  rAF; Spline: `app.stop()` / `app.play()`). Hidden tab is covered by the helper.
- Same look, cheaper: render on demand (only when a uniform/camera changes); lower
  `devicePixelRatio` cap (e.g. `Math.min(dpr, 1.5)`) — check it looks the same.
- Visual-change: run N seconds then freeze on a frame; show a poster image until interaction.

### Webflow IX2 (Webflow export or Webflow-hosted runtime)
- Recognise: `libs.webflowIx2` and an rAF source in the Webflow runtime (`webflow*.js` or the
  project's copy) at ~60/s at rest. IX2 runs **one endless rAF loop for the whole page** whenever
  the page has any continuous event (scroll-linked or mouse-linked interaction), even when
  nothing moves.
- Fix: patch the runtime's render loop to **sleep** when a frame changed nothing and no
  non-continuous instance is playing or delayed, and to wake on any IX2 action. Two traps, each
  of which shows up only in a timing test:
  - IX2 dates new instances to the session's last tick; after a sleep that tick is stale, so
    animations jump to their end. Re-time starts dated to the stale tick (not those dated 0).
  - Webflow restarts the IX2 session at each breakpoint change and leaves the old loop running —
    only the current session's loop may run (a generation counter).
- Also check events with `loop: true` (a looping Lottie or a pulse) — each keeps the loop awake;
  `loop: false` + a replay where the design needs it.
- The patch, with its traps explained: `references/webflow-ix2-sleep.md`.
- **Roll out per page type** behind an opt-in attribute on `<html>` (`data-ix2-idle-sleep`), one
  type at a time, each released before the next. Verify every type with a style-diff run
  (inline styles after every scroll step and hover, patched vs unpatched, twice unpatched to
  subtract noise) and a timing test (each animation started after a sleep still plays, not jumps).

### Timers (`setInterval`, re-armed `setTimeout`)
- Recognise: `intervalsPerSec` / `timeoutsPerSec` by source.
- Pollers (chat widgets checking state, typewriters, rotating headlines, countdowns): stop off
  screen / hidden; replace polling with an event where one exists.
- Third-party widgets (chat, VideoAsk, analytics, consent): usually not yours to patch. Report
  their cost, suggest loading them on interaction or after idle, and leave the decision to the user.

### Favicon / title animations, cursor followers, magnetic buttons
- Favicon animation: only while the tab is hidden, if at all; never a timer on a visible tab.
- Cursor followers: a loop only while the pointer moves or the follower is still catching up.

## What is *not* a problem
- A hover effect, a one-shot reveal, a transition that ends: they stop by themselves.
- `ScrollTrigger` at rest: no frames when nothing scrolls.
- A loop in a hidden tab already throttled by the browser — still fix it (the helper covers it),
  but do not count it in the idle table.
