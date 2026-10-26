# Fix catalog: what makes a page load slowly, and how to fix it

Every entry: how to recognise it in the PageSpeed result, the fixes that change nothing a visitor
sees (always first), and the traps. Fixes that change what a visitor sees are marked; they are
the person's decision. Measure every fix — an entry here is a candidate, not a promise.

## The metrics, in one line each

- **LCP** (largest contentful paint) — when the biggest thing in the first screen appears.
  Usually an image, a heading, or a hero block. Good ≤ 2.5 s.
- **FCP** (first contentful paint) — when anything appears. Held back by render-blocking CSS,
  fonts and scripts.
- **TBT** (total blocking time, lab) / **INP** (interaction to next paint, field) — how long the
  main thread is too busy to respond. Held back by JavaScript.
- **CLS** (cumulative layout shift) — how much the page jumps while loading. Good ≤ 0.1.
- **TTFB** (time to first byte) — how long the server takes to answer at all.

Start from the metric that fails worst and from `lcpElement`; most of a mobile score is LCP and
TBT.

## Render-blocking CSS and fonts (FCP, LCP)

- Recognise: `render-blocking-resources` / `render-blocking-insight`, long FCP with little
  JavaScript.
- Critical styles of the first screen inline or in one small stylesheet; the rest loaded without
  blocking. A stylesheet needed only below the fold loads as
  `<link rel="stylesheet" href="…" media="print" onload="this.onload=null;this.media='all'">`
  with a `<noscript>` copy: a `print` stylesheet is fetched at the lowest priority and never
  blocks rendering. (`rel="preload" as="style"` promoted on load also works, but takes a high
  fetch priority it does not need.)
- Fonts of the first screen preloaded (`<link rel="preload" as="font" type="font/woff2"
  crossorigin>`) — only the weights the first screen actually paints, matched to the URL the CSS
  requests so it is not fetched twice. Self-host rather than a third-party font CSS.
- `font-display: swap` (text shows at once in a fallback face) or `optional` (no swap at all, the
  web font only when it arrives in time). Either changes what the first paint looks like for a
  moment — `optional` visibly so on slow connections: that one is the person's call.
- Trap: preloading everything. A preload competes with the LCP resource; preload only what the
  first screen needs.

## The LCP element itself

- Recognise: `lcpElement`, `lcp-discovery-insight`, `lcp-breakdown-insight` (which phase is slow:
  server, resource load delay, load, render delay).
- An LCP image is discoverable in the HTML (not set by script or CSS background), has
  `fetchpriority="high"`, is **never** `loading="lazy"`, has `width`/`height`, and is served in a
  modern format (AVIF / WebP) at the size it is shown (`srcset` / `sizes`).
- An LCP heading held back by a web font: preload that font, or let the fallback paint first.
- An LCP that waits for JavaScript (a client-rendered hero, an animation that fades it in from
  `opacity: 0`): render it in the HTML and animate something else. A fade-in of the hero from
  invisible is a visible change — the person's call; the usual answer is to start the animation
  from visible.
- A heavy element in the first screen (3D, video, canvas): `heavy-elements.md`.

## JavaScript (TBT, INP)

- Recognise: `bootup-time` and `mainthread-work-breakdown` in the raw result (which script costs
  how much), `unused-javascript`, `legacy-javascript`, `third-party-summary`.
- Load what the first screen needs; split the rest (dynamic `import()` on interaction or near the
  viewport). In island frameworks, hydrate on `visible` / `idle` / a media query instead of on
  load; ship no JavaScript for static parts.
- `defer` (or `type="module"`) on every script that does not have to run before the first paint;
  nothing synchronous in `<head>` that is not essential.
- Long tasks at startup: break them up (yield to the main thread), move pure computation to a
  worker.
- Polyfills and transpilation for browsers the site does not support: drop them.
- Trap: a library loaded on every page for one page's widget. Load it where it is used.

## Third parties (TBT, LCP)

- Recognise: `third-party-summary`, `third-party-facades`.
- Analytics, tag managers, chat, video, reviews, maps: load after the page is idle or on
  interaction; a facade (a static look-alike) until the visitor reaches for it.
- Consent banners and A/B testing scripts that hide the page until they decide (an anti-flicker
  snippet) are an LCP cost every visit; report it with its number.
- Not always yours to change: a marketing or legal requirement may need the script early. Report
  its cost and let the person decide whether to move it.

## Images (LCP, total weight)

- Recognise: `uses-responsive-images`, `modern-image-formats`, `offscreen-images`,
  `uses-optimized-images`, `image-delivery-insight`.
- Below-the-fold images `loading="lazy"` with `width`/`height`; every image at the size shown,
  in AVIF / WebP, compressed. Decorative images in CSS only when not the LCP.

## Layout shift (CLS)

- Recognise: `layout-shifts` / `cls-culprits-insight`, `unsized-images`.
- Dimensions on every image, video and embed; reserved space for anything inserted after load
  (banners, embeds, ads, a late-mounting component); fallback-font metrics matched to the web
  font (`size-adjust`, `ascent-override`) so the swap does not move text.
- A cookie banner that pushes content down: overlay it instead (a visible change, usually an
  improvement — still say it).

## Server and delivery (TTFB, everything)

- Recognise: `server-response-time`, `document-latency-insight`, `uses-long-cache-ttl`,
  `uses-text-compression`, `redirects`.
- Static pages from a CDN edge; HTML cached where it can be; Brotli or gzip on text; long cache
  lifetimes for hashed assets; no redirect chain on the page's own address (a missing trailing
  slash, `http` → `https` → `www`).
- Trap: a slow TTFB from a server-rendered page doing work per request — that is a backend
  change, often bigger than the page; size it before proposing it.

## What is not worth chasing

- A point or two of lab score inside the run-to-run spread.
- An audit that fails with no saving on any metric (`savings` empty or zero).
- Lab score at the cost of what the page is for: a hero the product needs, a demo the visitors
  came for. Report the cost; the person decides.
