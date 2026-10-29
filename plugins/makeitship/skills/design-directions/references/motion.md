# Motion

Load this for the motion round — round 2 — and for any direction whose idea is in how it moves.
Motion is designed after round 1, on the chosen direction, and only when the person said yes.

## 1. Ask first

When a direction is chosen — or, for a small change, in the same message as its reduced round — ask
whether to add motion, always with a recommendation, in product words. (A small change that
neither appears, disappears nor changes has no motion question.)

- something on the screen appears, disappears, changes state or responds to the person: *"The
  card turns into a receipt after Confirm. I recommend a motion round: it is where the change
  reads as 'done', not as a jump."*
- nothing on it moves: *"Nothing on this screen changes or arrives; I'd skip motion. Say if you
  want it anyway."*

Only the person can decline. You never skip the question on your own.

## 2. Grammar first, then the elements

**The product's motion comes first.** An existing product usually has its own: the motion part
of the identity lock (`directions.md` §2), read from the live product and the code. Everything
the product already has — buttons, links, tabs, switches, menus, section entrances — keeps the
product's motion, unchanged, even where the gate or the table below would choose otherwise; the
anti-slop motion entries do not override it. New motion is only for what is new in this
design, and is built from the product's own curves and durations. The table and the easings of
§4 apply only where the product has no motion of its own. Name any departure from the product's
motion in the spec, with its reason, for the person to accept.

Then work top-down, then bottom-up:

1. **The grammar.** One or two principles for the whole composition, derived from the product's
   character and the direction's world — *"things settle like paper on a desk: quick to arrive,
   a short soft landing, no bounce"*. Every element's motion will be read against it.
2. **The elements.** For each element or group that moves, its own scenario from what it
   *means*: a permission being granted is a lock closing, a receipt being filed, a key changing
   hands — then pick the move that tells that story within the grammar.
3. **The whole.** Look at them together: one authored moment leads, the rest support or hold
   still. Two moments competing at the same scale means one goes.

When the elements are many (a whole page), research references per semantic case
(`references-research.md`); otherwise design from the grammar alone.

## 3. The gate: where motion belongs

Every candidate passes all four, in order, or it does not move:

1. **Frequency.** Seen 100+ times a day (keyboard shortcuts, a command palette, core
   navigation): never animated. Tens of times a day (hover, list navigation, toggles): nearly
   imperceptible or nothing. Occasional (dialogs, drawers, toasts): standard motion. Rare or
   first-time (onboarding, empty states, success, a celebration): this is where the delight
   budget lives.
2. **Purpose.** Name one: feedback, spatial continuity (where it came from, where it went),
   state change, preventing a jarring jump, explanation, or — only at the rare tier — delight.
   "It looks good" is not a purpose.
3. **Budget.** It works inside the timing below. A moment that only works long and showy fails.
4. **Function.** Data the person is reading or acting on does not move for style.

Write down the two to five places you considered and rejected, each with the check that
rejected it. That list is part of the round.

## 4. Thesis and timing

Before building, write the **motion thesis**: the focal moment (if any), the continuity the
screen needs, the feedback, and the budget (what is expensive and how often it runs).

| Duration | Use |
|---|---|
| 100–150 ms | immediate feedback (press, toggle) |
| 150–300 ms | routine state change |
| 300–500 ms | layout, overlay, view transition |
| 500–800 ms | one authored focal entrance |

- **By mode** (`modes.md`): Operate and Read stay at 150–250 ms and never choreograph a page
  load; Persuade and Experience may spend one focal entrance.
- **Exit faster than entrance.** Slow where the person decides, fast where the system answers.
- **Easing.** Entering and leaving: a strong ease-out (`cubic-bezier(0.23, 1, 0.32, 1)`);
  moving on screen: a strong ease-in-out (`cubic-bezier(0.77, 0, 0.175, 1)`); colour and hover:
  `ease`; constant motion: `linear`. Never `ease-in` on interface motion — it delays the moment
  the person is watching. Bounce and elastic only where the moment is playful and rare.
- **Physicality.** Never from `scale(0)`: start at 0.9–0.97 with opacity. Popovers grow from
  their trigger; dialogs stay centred. Pressables answer with `scale(0.97)` in ~160 ms.
- **Material by meaning.** `transform` and `opacity` are the foundation — they stay smooth. A
  reveal can be a `clip-path` or a mask, focus can be a bounded blur, depth a shadow change,
  when that is what the change means and the region is small. Never animate `width`, `height`,
  `top`, `left` or margins; never `transition: all`.
- **Content visible by default.** Nothing waits for an animation to become readable; a failed
  script leaves a working page.
- **Interruptible.** State changes that can repeat quickly use transitions, which retarget,
  rather than keyframes, which restart.
- **Hover motion** only where hover exists: `@media (hover: hover) and (pointer: fine)`.

## 5. The motion spec

Write the round's motion as a table, so the critic can check it without watching it:

| Element | Trigger | What moves | Duration | Curve | Order | Why (purpose, from the gate) |
|---|---|---|---|---|---|---|

Exact values, never "fast" or "smooth". The spec and the artboard must agree.

## 6. Seeing it without a recording

- **On your own artboard**, before the critic looks: trigger the motion, pause every running
  animation (`document.getAnimations().forEach(a => a.pause())`, or GSAP's global timeline when
  the page uses GSAP), set `currentTime` to three moments (early, middle, settled) and screenshot
  each — a filmstrip of three frames. Seconds, no video.
- **Before any screenshot** meant to show a resting state, let the entrance motion finish or
  disable it, or an element still fading in reads as missing.
- **Feel** — whether the timing is right — is judged by the person on the canvas, where the
  motion plays live. Say so; never claim the feel was verified.

## 7. Reduced motion

Every animation has a `prefers-reduced-motion` path, and it is gentler, not zero: remove
movement and position changes, keep the opacity and colour changes that carry meaning, keep the
feedback that confirms an action. Loops stop; nothing auto-plays sound.

## Sources

Adapted, in our own words, from Emil Kowalski's animation skills
([emilkowalski/skills](https://github.com/emilkowalski/skills), MIT) — the gate, the easing and
duration rules, the rejected list — and from the motion guidance of
[Impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0); see `THIRD_PARTY_NOTICES.md`.
