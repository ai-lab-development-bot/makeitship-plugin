# The anti-slop catalog

Read this before you build a round's artboards and again when you review them. It lists the
looks, layouts, motions and words a model reaches for when nothing pushes it elsewhere — the
category's defaults. A design made of them reads as "made by AI" even when every pixel is
tidy.

## How to use it

- **Defaults, not bans.** Every entry is something a brief can earn back: a pinned brand, an
  existing design system, a reason only this product has. "It looks clean" or "everyone does
  it" never earns one. When you keep one, say why in the direction's card.
- **Find it, then rewrite the element.** Softening a default (a lighter glow, a smaller
  eyebrow) keeps it. Replace the element with the decision the default was standing in for.
- **The product's own language wins.** Inside an existing product, the identity lock
  (`directions.md`) decides first: a default the product already uses is its style, not your
  slop — but do not add new ones.

## The AI clusters, and your own prior

Generated interfaces land in a few looks regardless of subject. Each is legitimate when a
brief asks for it; landing in one when the look was yours to choose means you did not choose.

- Warm cream ground, high-contrast serif display, a terracotta or signal-red accent.
- Near-black ground, one neon accent, glowing edges and halos.
- Editorial hairlines, an italic display serif, small tracked monospace labels.
- Flat saturated ink, black boxes, hard offset shadows, heavy condensed display type.
- Indigo or violet as the accent of anything "tech".

**Your own prior.** Warm, bookish, family or caring subjects come out as cream, serif with an
italic word, and lamplight; "technical" subjects come out dark with a mono font. Treat the
first palette that comes to mind as already spent, and derive the next one from the subject's
world (`directions.md`).

**The self-check.** If someone could guess your look from the category alone ("a fintech",
"a dev tool"), or from the category plus "but not the obvious one", rework it.

## Visual details

- **Glow and halo** — a radial gradient or zero-offset coloured shadow behind content ·
  default because it fakes depth for free · use spacing, contrast and a real shadow with offset
  and blur · earnable: yes, when light is the subject.
- **Glass everywhere** — blur and translucency on cards and bars · decoration, not layering ·
  keep blur for a surface that really floats over moving content · earnable: rarely.
- **Decorative grid lines or stripes** — a hairline grid or repeating stripes behind sections ·
  texture without a subject · keep grids for maps, canvases, measuring tools · earnable: yes,
  when the product measures or plots.
- **Side accent stripe** — a coloured left border on cards and callouts · decoration posing as
  status · keep it only where it means something (status, priority, selection).
- **Hairline border plus wide soft shadow** — two elevation systems on one card · pick one.
- **Extreme radius** — pill-round cards and sections · round small controls, not containers.
- **Floating or bobbing elements** — avatars and badges drifting in a loop · motion without a
  job · hold them still.
- **Icon tile above every heading** — a rounded square with an icon on top of each feature ·
  a template rhythm · put the icon beside the heading, or drop it.
- **Emoji as icons** — use a drawn icon set, one stroke and weight.

## Type

- **The one-word swap** — one word of a headline set in an italic serif, a script or an accent
  colour to look "tasteful" · the most current AI tell · create emphasis with size, weight or
  layout · earnable: yes, for a real quotation or a brand rule.
- **Label above the heading** — a small uppercase eyebrow over every section title · repeats
  the heading · delete it; keep one only where it carries information the heading does not.
- **Tiny numbered section labels** — "(02 — ABOUT)" · numbering with no sequence · keep
  numbers for real steps.
- **Monospace as a costume** — mono labels and HUD text to look "technical" · mono is for code,
  data and measurement.
- **Overused faces** — Inter or a system sans as a display voice on a brand page, and the
  usual suspects (Space Grotesk, DM Sans, Instrument Sans, Playfair, Fraunces) chosen without a
  reason · pick the face for the subject and the reading job · earnable: yes, when the product
  already uses it.
- **Oversized hero headline** — a headline so large the page cannot explain the offer.
- **Crushed tracking** — display tracking past -0.04em.
- **Flat hierarchy** — headings and body that differ only by a size step.

## Colour

- **Indigo/violet by default** — the training-data accent · choose the hue from the product.
- **Cream and beige by default** — keep only when it belongs to the product.
- **Dark mode with glowing accents** — dark chosen by category, light picked out with neon ·
  choose light or dark from the use scene: who, where, under what light.
- **Gradient text** — emphasis from weight or size instead.
- **Grey text on a coloured ground** — tint secondary text from the ground's hue.
- **Even colour everywhere** — no dominant colour and no sharp accent · let one colour own a
  region.

## Layout

- **Identical card grids** — same-size cards of icon, heading and text as the page's
  structure · group by meaning and vary the treatment; a card only where the container carries
  an interaction.
- **Nested cards** — flatten with spacing, type and dividers.
- **The hero-metric block** — big number, small label, three supporting stats · lead with a
  number only when it explains the product, with context.
- **The split hero** — copy on the left, product on the right, a logo row below · the template
  whatever palette paints it.
- **The stock page** — hero → feature grid → testimonial → pricing → FAQ → CTA, chosen because
  every page has it.
- **Monotonous spacing** — one gap everywhere · related things close, groups apart, more space
  above a heading than below it.
- **Modal by reflex** — a dialog for something that needs no interruption.

## Motion

- **The same entrance on every section** — fade up from transparent, 16–20 px, staggered by
  ~80 ms, on every block that scrolls in · the single most common motion slop (a widely shared
  "Swiss" design-system file prescribes exactly this) · one authored moment, the rest still.
- **Blur-in** — content resolving from a blur on load · decoration on the slowest path.
- **Marquee for its own sake** — an endless logo or slogan strip · hold still, or give it pause
  and a reason.
- **Pulsing dot, blinking cursor** on static text · motion where nothing is live.
- **Bounce and elastic easing** on routine UI · settle quickly; keep play for a moment that
  earns it.
- **Content waiting to appear** — a preloader, a scroll lock until an intro ends, text hidden
  until an animation runs · a quality defect: content is visible by default and survives a
  failed script.
- **The expensive tier** — preloader + WebGL scene + scroll-jacking + monospace HUD + a sound
  toggle · craft does not turn it into an idea.

## Copy

- **Forced contrast** — "Your tools are guessing. We actually know.", "Don't just scroll, go
  explore." · say the useful point directly.
- **Copy about the page itself** — "scroll to explore", "close the laptop".
- **Triads of abstract nouns** — "considered, warm, and built to last".
- **Generic claims** — "seamless", "powerful", "next-generation", "in the age of AI",
  "supercharge your…", "elevate your…", "in today's fast-paced world…", "unlock" as a metaphor ·
  say what the person can do and what changes for them.
- **Aspirational headings on working screens** — "Unlock your growth" where "Revenue this
  month" belongs · on Operate surfaces a heading orients and reports.
- **A pun on the brand name** as the closing line.
- **Em-dash chains** — use full stops.
- **Invented proof** — clients, logos, numbers, testimonials the product does not have (see
  `craft-floor.md`, Truth).

## Imagery

- **A weak fake picture** — a scene, a person or an object drawn badly in SVG or CSS · make it
  well (`illustration.md`) or leave an honest slot.
- **Stock that could be anywhere** — unrelated photos (hands on pottery, a chair, a glass
  building) on one page · one photo of the subject's real object.
- **Decoration in place of the subject** — a globe with labels orbiting it where a map was the
  idea · the decoration must show the thing.
- **A UI chip over a lifestyle photo** — a floating notification on a smiling person · now a
  category default; earnable when the chip is the product's real moment.

## Quality

Contrast, measure, overflow, clipped menus, text under other layers, missing states — these are
not taste. They are in `craft-floor.md`, and every round passes them.

## The tests

- **The swap test.** Replace the brand with a neighbour in its category. If nothing breaks, the
  design is the category, not the product.
- **The coffee-shop test.** Replace the logo with a coffee shop, a boutique hotel or a literary
  magazine. If the page still looks plausible, it is generic editorial.
- **The memory test.** What would someone describe an hour after seeing the first screen? A
  mood means the direction has not committed; an idea means it has.
- **Repetition across references.** Anything three or more of your references share is the
  category's default: push off it, never copy it (`references-research.md`).

## Two price tiers

Cheap slop is a builder's defaults: blur-in, bobbing, fade-up, `0.3s ease` on everything.
Expensive slop is a studio's defaults: the preloader, the 3D scene, the hijacked scroll. Judge
both by the same question: does it come from this product, or from the category?

## Sources

Built from a review of sixteen live sites (2026), and adapted, in our own words, from the slop
catalog of [Impeccable](https://impeccable.style/slop/) (Apache-2.0, see
`THIRD_PARTY_NOTICES.md`).
