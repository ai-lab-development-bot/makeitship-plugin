# The craft floor

Every artboard passes these before the person sees it. They are checks on the rendered
result — look at the screenshot, read the computed values — not intentions. The floor holds the
mechanics; it never picks the direction. With every check green, spend the effort on the
direction's idea.

## Verify on the render

- **Contrast.** Body and placeholder text at least 4.5:1, large text and controls 3:1, in
  every state shown. On a coloured surface, secondary text is a darker or lighter tint of that
  surface or of the foreground — never a neutral grey.
- **Depth.** A shadow has an offset and a soft blur. A zero-offset coloured halo is decoration.
  One elevation system per element: a border or a shadow, not both.
- **Spacing.** Related things close, groups clearly apart, more space above a heading than
  below it. One spacing scale, read from the product when it has one.
- **Type.** Body text 16 px or the product's body size; a reading measure of 65–75 characters;
  headings balanced (`text-wrap: balance`), body without a lone last word
  (`text-wrap: pretty`); distinct steps between heading, body, label and metadata; display
  tracking no tighter than -0.04em.
- **Real content.** The product's real labels, data and copy, at their real lengths, including
  the longest one. No lorem ipsum, no "Feature one".
- **States.** The states that matter for this screen: default, hover and focus on the controls
  shown, and the empty, loading, error and success states the brief touches.
- **The browser surfaces.** The parts nobody draws ship with browser defaults unless you theme
  them: text selection, the caret, focus rings, scrollbars, link underline offset, tabular
  numerals in numbers that line up. Theme them from the palette; it is the cheapest sign a page
  was designed rather than assembled.
- **Controls are controls.** Real buttons, links and labelled inputs, at least 44 px tall on
  touch surfaces; no `transition: all`.
- **Phone width.** The artboard, or a second one, holds at 390 px wide: nothing overflows,
  menus stack, tables scroll inside their box.

## Truth

Prove, don't claim.

- **Demonstration data** — names, numbers, entries, screenshots of the product at work — is
  design material: author it at full fidelity, and mark it as an example wherever a visitor
  could take it for real.
- **Claims stay uninventable**: clients, logos, testimonials, prices, benchmarks, certifications
  and capabilities the product does not have. Where one is needed and missing, a visibly marked
  placeholder (`[CUSTOMER QUOTE]`) and a line in the card asking the person for it.

## Token roles

A token's role is part of the token. When the product, or a direction, gives a colour, a font,
a radius, a shadow or a gradient a job, it keeps that job: an accent reserved for the primary
action never becomes a section background; code colours stay inside code; a decorative gradient
never becomes a surface or a control. Combining sources means giving each source a bounded job,
not moving its tokens around.

## Media role

When a direction is carried by imagery — a photograph, an illustration, a product shot, a
texture — the image keeps its place in the composition. Make it well (`illustration.md`), use a
real asset the person has, or leave an honest slot at its real size with a one-line art
direction. Never collapse an image-led direction into text and buttons, and never fill the slot
with a weak fake.

## Sources

Adapted, in our own words, from the craft floor of
[Impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0, see `THIRD_PARTY_NOTICES.md`).
