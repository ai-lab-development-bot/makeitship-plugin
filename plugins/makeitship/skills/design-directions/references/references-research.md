# Reference research

Load this in the motion round, when a semantic case (`motion.md` §2) needs to see how others
solved it. Not in the static round: there the reference is the product as it is. Research costs
real time — a few minutes and a large share of the context per case — so spend it where it
changes the design.

## When, and how much

- Only in the motion round, and only for cases the grammar alone does not settle.
- **3–4 references per semantic case**, not a dozen. With a subagent tool, one subagent per
  case, each returning its findings, not its browsing.
- You choose the references yourself; when the person brings one ("like the way X does it"),
  it goes first.

## Tools: a browser and a page fetch, nothing else

- **The browser** — anything visual or built by JavaScript: listings, live sites, motion,
  frames. The mechanics are those of the `web-ui-exploratory-qa` skill in this plugin: its
  section "The browser: Playwright CLI, and nothing else" for opening pages (the pinned CLI, one
  named session per subagent, a temporary run folder), its Step 7 for capturing a screen, its
  Step 10 for closing the browser. Its audit loop and fix protocol are not yours.
- **A plain page fetch** — pages that are just text, and raw files.
- **Clear overlays first.** Cookie banners, newsletter modals and chat bubbles cover what you
  came to see: click their accept or close, or hide them, before any capture.
- **A wall is a skip.** A site that blocks automated browsers (a "you have been blocked" page)
  is recorded as unreachable and skipped — never retried, never worked around.

## Sources

| Source | What it is for | How to read it |
|---|---|---|
| Awwwards Sites of the Year, Godly, Locomotive's work list | live sites to read motion from | the listing gives names and live links (fetch or browser); open the live site in the browser |
| Dribbble | motion concepts — mostly concepts, not shipped products: judge them harder | browser only (a fetch returns an empty page); a shot's page holds its video file |
| A gallery of design-system files written for agents | **counter-examples only** — the motion they prescribe is often the slop itself | fetch |

## Reading a live site's motion

Open the site, clear overlays, let it settle, then run the skill's motion reader:

```
pw eval "$(cat <this skill's folder>/scripts/motion-grammar.js)"
```

It returns, from the page's own stylesheets and running animations: libraries in use (GSAP,
Lenis, Locomotive, a 3D canvas…), the transitions and curves the site really uses, its named
duration and easing variables, its keyframes, the selectors and attributes that trigger motion
on scroll. Then find the element that plays the same role as your case and take a filmstrip of
it (`motion.md` §6). Sites drawn entirely on a `<canvas>` or in WebGL expose no values: take
three screenshots a few hundred milliseconds apart instead, and say so.

## Reading a video

Open the video file's address itself in the browser (on a Dribbble shot, the `.mp4` the page
links to), then:

```
pw eval "$(cat <this skill's folder>/scripts/video-strip.js)"
pw resize 1440 200
pw screenshot
```

The page becomes one strip of six evenly spaced frames — no video tools needed.

## Judging what you found

Every reference gets a verdict — **SLOP**, **MIXED** or **BORROW** — with the single strongest
reason, never a hedge. Being in a gallery or winning an award is not a reason.

- **Motion comes from the content.** What is worth borrowing moves *because of what it shows*:
  a second state of the same object revealed by the pointer; the opening image becoming the
  evidence; a glimpse of the work set inside the claim; a product moment acted out (tap → result
  → hold → leave); quiet idle life instead of an entrance.
- **Repetition is the default.** Anything three or more references in your batch share — a
  marquee, a UI chip over a lifestyle photo, a staggered text reveal — is the category's
  default: push off it, never copy it.
- **The swap and memory tests** apply to references as to your own work (`anti-slop.md`).
- **Borrow the principle, not the clothes.** Write what you take as a rule ("the reveal hands
  over from the hero to the evidence it describes"), never as a copy of the site.

Report per case: the references (name and link), each verdict with its reason, the principle
taken, and what was rejected as default.
