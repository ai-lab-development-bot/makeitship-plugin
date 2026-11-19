---
name: create-asset
description: >
  Make a visual asset for any request, in any project and domain: an illustration, a photo-like
  wide image of people or nature, part of a scene, a background, a texture, a banner, a cover, a
  graphic element, an icon. Use when the person asks to generate, draw, create or replace an
  image, when a task needs a visual that does not exist yet, and when
  `design-directions` needs imagery for its directions. First decides whether to generate at
  all (an existing asset, the project's icon library or its vector convention may be the right
  answer), then whether the asset needs a transparent background, and takes its style from the
  project or the person's reference in any form. Generates through Codex: natively inside
  Codex, or from any other agent by running Codex inline and operating it like a person would;
  without Codex, recommends setting it up and asks whether to use another available image
  generator or to hand over a ready prompt. Then checks the result, fits it to where it
  goes only where needed, and puts it there.
---

# Create an asset

An asset is anything visual a product shows: a wide photo-like image of people or nature, an
illustration, part of an animated scene, a background, a texture, a banner, a cover, a small
graphic element, an icon. Do not read this skill as an icon skill; size, genre and purpose vary
from request to request.

The goal: a request for a visual ends with a good asset in the right place, made by you without
the person in the loop whenever the machine allows it. Codex generates the image; you do the rest
— decide what is needed, write the brief, run Codex, judge the result, fit it, place it.

## Who you are working for

The person is most likely the product owner. Briefs, tools, formats and folders are yours: decide
them and say what you did in a sentence. What reaches them is what they will see, and the facts
only they hold (a brand they have, a reference they like, where a file must go when nothing in
the work says it), asked once, in product words.

## 1. Is generating the right move

Look at what the product already has before you generate anything:

- **An existing asset fits** → reuse it. When the person asks for a new one where an asset
  already exists (a file, or a drawing written as code), making it is fine; replacing the old one
  in the product needs their yes.
- **The request is an icon and the project uses an icon library** (in its dependencies and used
  across its screens) → take the icon from that library. A generated icon next to a library's
  icons breaks the project's convention. Generate one only when the person asks for it, or the
  library has nothing that fits — and then in the library's style.
- **The project keeps this kind of asset as vector** (SVG files, inline SVG components) → follow
  the convention. The convention is set by the closest neighbours: the asset already in this slot,
  then assets of the same kind and role elsewhere in the product; when they disagree, the closest
  one wins, and say which you followed. A simple vector — a few flat shapes, the kind an icon set
  or a diagram is made of — you draw yourself, as code, in the project's stroke, radius and
  colours. For a complex one (a scene, characters, texture, light, a photo-like picture), propose
  a raster from the generator, say what the project gives up with it (it does not scale or
  recolour like its other vectors), and go on with it only on the person's yes.
- **Otherwise** → generate.

## 2. Understand the asset

From the task and the project, settle before you write a brief:

- **what it is for** and what it must say;
- **where it is shown**: the screen or page, the slot, its displayed size and proportions on
  every width the product supports;
- **the surface under it**: the colours behind it, and both themes when the product has a light
  and a dark one;
- **what form the place needs**: a file in a repository, an image in a CMS, a file for the
  person, something else.

**Transparent or with its own background** is a decision, made explicitly every time, from the
essence of the task and the pattern already in the project: look at how similar assets are made
there. A part of an interface or a scene laid over other content usually needs a transparent
background, so it sits on any surface and in both themes; a wide picture, a cover or a backdrop
usually carries its own. When the project does it one way, follow it unless the task needs the
other, and say why.

## 3. Style and references

The session may have no direct reference for this exact request. Work from what there is:

1. **In the project's code** (the usual case): find similar components and the assets they use,
   and make the new one in their style — subject treatment, line, shape, palette, light, level
   of detail.
2. **No direct reference for this request**: take the style of neighbouring assets and the
   project's design tokens (colours, radii, typography, the overall feel) as inspiration and as
   references in the brief.
3. **The person's reference**: you may ask for one, in addition to 1 and 2. It can come in any
   form: words, an image, a link, a file, a frame in a design tool, a website, whatever they
   have. Use what they give. If they give nothing, take the initiative and make the asset from
   its context and the task; do not stop and wait for a reference.

Give the generator the reference images themselves (attached), not only a description of them.
Never reproduce known characters, logos, mascots or existing artworks.

## 4. Reach Codex — find your route

Codex makes good assets, including images with a genuinely transparent background. It ships its
own image-generation skill (today called `imagegen`); how that skill works — its tools,
parameters, sizes, where it saves files — is Codex's to say and changes over time. Use it and
follow what Codex advises; this skill only supplies the context.

- **A. You are Codex.** Generate with your own image-generation skill, with the brief from
  `references/prompt.md`. Do not start another Codex from inside Codex.
- **B. You are another agent (Claude Code or any other) and Codex is on the machine and signed
  in.** Run Codex inline and operate it the way a person would: `references/codex-inline.md`.
  Always in the foreground, never in the background: a detached Codex loses the link with you and
  you with it. You decide how many runs the asset needs.
- **C. Codex is missing or not signed in.** Tell the person, in product words: Codex gives good
  results for this work, and with it set up (the Codex CLI installed and signed in with a
  ChatGPT/Codex subscription) you will make assets by yourself next time, without them. Recommend
  the setup strongly, with its steps (`references/prompt.md`, "Without Codex"). Never install or
  sign in to Codex on your own: give the steps, and run them only on the person's yes. Then ask
  how to go on now:
  - with **another image generator this session has** — name the ones you actually see (an image
    tool of your own, a design tool's MCP, an image MCP); or
  - with **the full prompt in the conversation**, ready to copy into Codex or another generator.

  With no other generator in the session, give the prompt straight away.

## 5. After it is generated

- **Look at it.** Open the image and judge it: the subject, the style against its references,
  the composition and proportions, no stray text or artefacts. For a transparent asset, check
  that the background really is transparent and look at it on a light and on a dark background:
  clean edges, no halo, no leftover backdrop. Check the pixels, not only the look: the background
  fully transparent, the subject fully opaque (a subject that is slightly see-through shows the
  content behind it), and only the edge in between.
- **Iterate** with one targeted change per run until it meets the bar. When it cannot, say so
  and show the best take rather than shipping a weak one.
- **Fit it to the place, only where needed.** Crop, resize, or convert the format when the place
  requires it. Generate larger than needed and scale down, never up; for a screen, ship at least
  twice the displayed size, as one file or as the 1×/2× set the project already uses. Before any conversion or compression, think through how the result renders across
  browsers and platforms (Safari included) and what the project already serves; no optimisation
  for its own sake. Keep the original output until the fitted file is checked.
- **Put it where the work needs it**: a repository, a CMS through its MCP, a file on the
  person's machine, or wherever the task points. Decide from the context; nothing here is fixed.
  Follow the rules of that place: in a repository, the project's usual way of shipping code —
  including the code, tests and docs that use or name an asset you replace; in a CMS, `work-with-cms` (content goes through staging first, the live site is the person's call).
  Never overwrite an existing asset without a yes; never leave an asset the product uses only in
  a generator's own output folder.
- **Report** in a few lines: what was made, where it is, which route made it, and anything the
  person may want to judge.

## 6. With `design-directions`

- **A concrete request** ("an illustration for this empty state", "the parts of this scene", "a
  hero picture for this page") → this skill alone: one finished asset in the product's style, no
  menu of variants.
- **An open request where the person chooses between ideas** (concept, composition, style), and
  any screen, flow or other visible change → `design-directions`. It calls this skill for the
  imagery a direction needs, when imagery makes the direction better; the same §1 rule applies
  there, and existing icons and images are reused.
- **Inside a directions round**: one image per direction by default; when generation is not
  available or not worth the wait, the direction keeps an honest slot (the image's place at its
  real size with a one-line art direction); on route C, one copyable prompt per direction.
  Nothing made for the canvas is placed into the product until a direction is chosen.
