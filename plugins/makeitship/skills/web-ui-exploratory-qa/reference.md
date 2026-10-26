# Why testing runs screen by screen

Background for the capture rules in `SKILL.md`. Every number here was measured in a
real browser session on a long article page, not estimated. Read this when you need to
justify the approach, explain it to the user, or decide what to do with an awkward
page.

## Two different screenshots, two different limits

The word "screenshot" covers two separate things in this workflow, and each has its own
ceiling:

| | What it is | Its limit | What happens past the limit |
|---|---|---|---|
| **The browser's capture** | the picture Chromium paints of the page | **16384 screen pixels** tall | the picture repeats the page from the top; far past it, the browser crashes |
| **What you actually see** | the picture as it reaches you for inspection | **2000 pixels** on the longest side | the whole picture is shrunk to fit; fine detail disappears first |

They are independent. A capture can be perfectly valid for the browser and still be
useless to you because it arrived shrunk twentyfold.

## Limit 1 — what the browser can capture

Chromium (Chrome included) paints at most 16384 pixels into a single capture. The budget is counted in
**screen** pixels — the page height multiplied by the pixel density being emulated — so
emulating a phone at density 3 spends the budget three times faster than density 1.

Past the limit the capture does not fail loudly. It **starts drawing the page again from
the top**, while the file keeps the full page height, so nothing about the file looks
wrong.

Measured on a 39798-pixel-tall article page at density 1:

| Position in the capture | What it contains |
|---|---|
| 0 → 16384 | the real page |
| 16384 onward | the page again from the very top — pixel-identical to the beginning |

At density 3 the same page came to 168882 screen pixels and the capture **crashed the
browser**: the session restarted, no file was produced.

Practical reach of a single capture:

| Emulated density | Page height that still fits |
|---|---|
| 1 | ~16384 px |
| 2 | ~8192 px |
| 3 | ~5461 px — less than two phone screens |

## Limit 2 — what you can actually see

Whatever is captured is shrunk to 2000 pixels on its longest side before you inspect it.
The file size is irrelevant: a 15 MB image is accepted without complaint and arrives
unreadable.

Measured on captures of the same page:

| Capture | Reaches you as | What survives |
|---|---|---|
| 1475×900 — one screen | 1475×900, untouched | every word, label and caption |
| 1475×6000 | 492×2000 (3× smaller) | section headings; body text is grey mush |
| 1475×39798 — whole page | 74×2000 (20× smaller) | vague blocks, nothing readable |

Defects live in the detail that is destroyed first — a misaligned label, a clipped
button, text overlapping an image. A page-tall capture cannot show any of them.

## The media problem

The browser reports a page as loaded long before its pictures exist. Measured on the
same page, immediately after opening it:

| | Right after load | After scrolling the whole page |
|---|---|---|
| Browser's own "loaded" signal | already `complete` | `complete` |
| Images present | 23 of 123 | 113 of 123 |
| Capture file size | 15.3 MB | 24.5 MB |

Pictures and videos below the visible area load only once they are scrolled into view,
so anything captured straight after opening shows blank gaps that are not real defects.
Scrolling the page through is what makes the media appear.

A residue that stays missing afterwards splits in two:

- the element is hidden or has no size → the user sees nothing, not a defect;
- the element **takes up visible space and stays blank** → a real defect: the user sees
  a hole where a picture should be.

## The conclusion

All three findings point the same way: **check a page one screen at a time.** Screenshot
the visible area, scroll one screen, screenshot again — and compare each screen against
the matching part of the reference before moving on.

This is the default strategy, not a fallback for awkward pages. A single page-tall
capture is the exception: useful only for judging overall composition (block order,
what is present or missing, proportions), and only when the page fits inside the
browser's capture limit.

## Explaining it to the user

When the user asks how the testing is organised — or why it works this way — give them
the reasoning in their own terms, without pixel counts or tool names:

> A page is checked one screen at a time rather than as a single long picture. One tall
> picture of a whole page can't be trusted: past a certain length the browser starts
> drawing the page over again from the top, pictures that only load as you scroll are
> simply missing from it, and squeezing something that long down to a viewable size
> destroys exactly the small details a defect hides in. Going screen by screen keeps
> everything at full detail, so nothing slips through.

Bring out the numbers only if they ask for them.
