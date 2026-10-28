---
name: design-directions
description: >
  Use when the person wants to design, mock up, redesign or visually iterate on anything —
  app screens, flows, landing pages, dashboards, components, motion, or visual assets such as
  icons, illustrations, banners and posters — or describes a UI in words that would be clearer
  seen than read ("show me what it could look like", "mock up the archive screen", "how
  should this animate?"). Puts several genuinely different directions on a visual canvas,
  each grounded in the product as it is and derived from its audience's world, never the
  category's default; reviews its own work against a quality bar before showing it; one
  direction recommended, then the chosen one refined, its states, illustrations and — when
  the person says yes — its motion. Also a required step before building any visible change
  in a task (`create-task`, `work-on-task`) unless the person declines; a mock-up only
  illustrates a task, never replacing its text.
---

# Design directions

Turn "make me a screen / a visual / an asset" into **a canvas with several genuinely different
directions**, reviewed before the person sees them, then iterate with the person until one wins
— and refine that one until it is ready to build.

Three ideas drive this skill:

1. **Show, don't describe.** If the thing will be judged by looking at it, it belongs on a
   surface the person can see, compare, comment on and edit — not in a paragraph.
2. **Diverge before you converge — away from the default.** The first idea is usually the
   category's default, and the default is what makes a design read as machine-made. Each
   direction is a different answer to the problem, derived from the product and its audience,
   never a different skin on the same layout.
3. **Nothing is shown unreviewed.** You render, look, have it judged, and fix before the person
   sees it. The person's time goes to choosing, not to catching your mistakes.

## Who you are working for

The person is most likely the product owner, not a designer or an engineer. They know what the
screen is for and who uses it; they judge by looking, and they should never have to speak the
vocabulary of the craft.

- **The exploration is yours.** The brief, the derivation, the craft, the review: you decide
  them. Words like "information architecture", "identity lock" or "primary axis" stay in your
  own notes; what the person reads is what a user would notice.
- **The choice is theirs, and it reaches them recommended.** Every direction is one you would
  defend, and one of them carries your recommendation with its reason in product words. They
  confirm it, pick another, mix, or ask for others.
- **Facts only they hold are asked once, in product words, with the reason**: the address of
  the product and a login when you need to see it, a brand or a design they already have, who
  the screen is for when nothing tells you. One message, not a drip.

## 1. When to use it

### Required: any visible change in work you are doing

When you create, plan or carry out a task, and the result is something a person will see in the
interface — a new or changed page, screen, dialog, element, block, state, layout, text or
animation — **the round is a required step before any code is written**, not an offer. The
person sees and picks the look on a canvas first, so their feedback lands in minutes instead of
after a whole build; then the chosen direction is built.

Only two things skip it:

- **A finished design to build as drawn** (a Figma frame, screenshots, a direction from an
  earlier round that passed its gate — §4): the person has already seen the look. A direction
  that was only picked, with round 2 or the motion question still owed, is not finished: run
  what is owed.
- **The person said so**, in so many words, for this change ("no canvas, just build it"). An
  ignored offer or silence is not a no: ask once more, plainly, and wait.

Never decide it for them. "It is built from blocks the product already has", "we agreed the
shape in words", "it is cheap to change later" and "it is a small change" are not reasons to
skip: what ships is a look the person has not seen. A small change gets a small round (§4), not
none. Record a skip in the task or the report with their words.

The rest of this section, the offers and "never offer twice", is for ordinary conversation,
where nobody has asked for anything to be built.

**Use directly** when the person asks to design, mock up, wireframe, redesign, "show what it
could look like", animate, or make a visual asset (screen, flow, landing page, dashboard,
component, poster, ad, social post, app icon, illustration, banner, invite).

**Offer it (one short line, then carry on)** when the person describes an interface in words, a
discussion keeps circling around how something should look or behave, they are choosing between
layouts in the abstract, frontend work is about to start with no design, or `create-task`
proposes the shape of something new.

> Want me to put a few quite different takes on this screen side by side, so you can compare
> them before we decide?

Do not hijack: if the person only wants an explanation or a quick inline diagram, do that.
Never offer twice when they ignored the offer. Neither applies to a visible change you are about
to build: that round is required.

## 2. Pick the surface (detect, never assume)

Surfaces differ between agents and deployments, and new ones appear. Check which tools exist in
this session and use the first that fits. Never hardcode artifact URLs or ids — they differ per
account.

Claude (Claude Code, the Claude apps) uses its Artifact tool (the `Artifact` tool, which
publishes a page to claude.ai), steps 1–2. **When that tool is in the session, it is the
surface**: never fall back to plain files while it is available. Codex and other agents use
their own equivalent of a published visual page or canvas when they have one, following the
same layout rules; otherwise steps 3–4.

1. **An Artifact tool that lists types** (`Artifact`, starting with its `quickstart` action,
   intent `design` — or `slides` for a presentation): if a **Design** type (a canvas with
   artboards) is listed, create the work from it and follow the instructions it returns. If a
   **Design System** type is listed and one is marked default (or the person names theirs),
   build with it — unless the product already has its own design system, which wins (§3).
2. **An Artifact tool without a fitting type**: one self-contained HTML page laying the
   directions out as equal-size artboards side by side (stacked on narrow screens), published
   as an artifact.
3. **An inline visual tool only**: render the directions inline, one per call with a sentence
   of framing between them; say that a canvas would let the person keep and edit them.
4. **No visual tool**: plain HTML, CSS and JavaScript files, self-contained (no external
   dependencies beyond CDNs and web fonts); tell the person how to open them in a browser.

Whatever the surface, **write each artboard as a local file first**, in a temporary run folder
(never the person's repository): that is what you review (§7) before anything is published. If the person named a tool or a format (Figma, a `.png`, a
`.pptx`), use that and skip this ladder.

## 3. The product first, then the brief

Most of the time the product already exists, and a direction that ignores it is a direction
nobody can ship. Before the first artboard, find out what the new thing must live next to:

- **In the code, when you are in the project (read-only)**: the design tokens (colours, type,
  radii, spacing), the components the screens are built from, the screens next to the one being
  designed, the product's own design guidance if the repository has one.
- **In the running product, when there is no code**: look at it through a browser. The browser
  mechanics are those of the `web-ui-exploratory-qa` skill in this plugin — **its "The browser:
  Playwright CLI, and nothing else" section for opening the product, its Step 7 for capturing a
  screen properly, and its Step 10 for closing the browser when you are done.** Read those
  sections and follow them. Its lenses, its loop, its artefact folder and its fix protocol are
  not yours: you are looking, not auditing, and you change nothing.
- **Neither the code nor a browser**: read the product's pages as text with a page fetch, ask the
  person for two or three screenshots, and say in one line what you could not see. The round
  goes on.
- **A new product, or a person with no product yet**: nothing to inherit.

Every round starts from the product as it is: nothing about it is stored between rounds, and
you write no design files into the person's repository.

Then, in your notes:

- **The mode** of the surface — Persuade, Operate, Read or Experience — chosen from the surface,
  never from the product (`references/modes.md`). It sets how far the design may express itself.
- **The identity lock**, when the product has a design language: one sentence of what is on
  screen, in real values (`references/directions.md` §2). It binds every direction unless the
  person asked for a new look.
- **The minimum brief**, extracted from the conversation, not interrogated: the goal and its one
  primary action; who, on what device, in what situation; the real content (actual labels,
  data, copy — invent realistic demonstration content when none is given, never lorem ipsum,
  never invented claims); the constraints.

If something critical is missing **and** a wrong guess would waste the whole round, ask at most
one or two questions. Otherwise state your assumptions in one line at the top and start.

## 4. The rounds

**Round 1 — directions.** Two to five directions (three by default), each as **one key screen
or state at full fidelity**: the product's tokens, real content, the craft floor met. Never a
wireframe — the person judges by looking, and a grey box convinces nobody. The person picks,
mixes, or asks for others (§8).

**Round 2 — the chosen direction, finished.** The remaining screens of a flow, every state that
matters (empty, loading, error, success), the illustrations (`references/illustration.md`), the
knob values the person settled. When the value is in how it feels to use — onboarding, gestures,
a flow of several steps, a game or a playful product — round 2 is a **clickable prototype** of
the chosen direction: working buttons, state changes, links between its screens, simple
feedback; not another set of static states. Skipped when nothing is left to add.

**The motion question.** When round 2 is done, ask whether to add motion — always, with a
recommendation (`references/motion.md` §1). On a yes, the motion round designs it on the chosen
direction, with reference research when a case needs it (`references/references-research.md`).
Only the person can decline.

**The gate.** Nothing visible is built until the direction is chosen, round 2 is done (or there
was nothing left for it) and the motion question is answered — for a small change, only when
the element appears, disappears or changes; one that does not move has no motion question.

**A small change** — one element, one state — gets a reduced round: two or three takes on that
element only, inside the identity lock, reviewed like any round; round 2 only if something is
left; no reference research. When the element appears, disappears or changes state, the motion
question rides in the **same message as the round**, with its recommendation — a reduced round
usually has no round 2 to wait for, so asking "later" means never asking.

## 5. Diverge

The full method is `references/directions.md`. In short:

1. **Name the rut** — the page this category always ships, and its predictable opposite — and
   the AI clusters and your own first palette (`references/anti-slop.md`). None of them is a
   direction unless you can argue it for this product.
2. **Under an identity lock**, directions differ on different primary axes — hierarchy, layout,
   type system, colour strategy, density, structure — inside the product's language.
3. **Derive candidates from the audience's world** — its objects, places, rituals, publications,
   graphic traditions — five to seven across at least three material families; never a costume
   of the tools they operate on a working screen. For a new product or a requested redesign, a
   candidate becomes a whole direction; under a lock, it supplies the direction's signature
   move.
4. **Squint** at the set: two directions that rhyme are one.

Visual assets (icons, illustrations, posts, posters, banners) diverge on concept first —
literal, symbolic, abstract, typographic, character — then on composition and rendering, inside
the product's illustration or icon style when it has one; keep the format identical across
directions. Never reproduce known characters, logos, mascots or existing artworks.

## 6. Build and present

- **Same content, same frame size** in every direction — the person compares ideas, not data.
- **The craft floor and the anti-slop catalog** are met while you build, not patched after
  (`references/craft-floor.md`, `references/anti-slop.md`). Demonstration data is marked as an
  example; claims are never invented.
- **Knobs.** Give each direction zero to four coarse controls the person can turn without a
  regeneration — density, colour amount, type scale, one structural switch — wired to variables
  the artboard is built on. On a Design canvas they are the artboard's tweaks (its declared
  props); elsewhere, a small control strip outside the design.
- Name each direction evocatively ("A — The Receipt Drawer") and give it a short card:
  - **The bet** — one sentence: what this direction wagers on.
  - **Best for** — which user or situation it wins.
  - **Gives up** — what it trades away, including any platform convention or product pattern
    it breaks.
  - **What it costs** — built from what exists / needs a new component / needs a change to how
    content is stored. Cost never decides the design; it is reported so the choice is informed.
  - **New tokens** — any colour, font, radius or other value outside the product's system:
    name, value, why. None, under a lock, is the normal case.
  - On exactly one card: **Recommended** — why, in one clause about the product.
- **Where the card lives**: outside the design, so the artboard stays a clean, editable design —
  a note next to its artboard on a canvas; with no notes, a caption beside the frame or the
  reply. Never bake rationale into the mock-up.
- **Language.** Text inside the mock-up is in the product's language — an English product gets
  English labels whatever language the conversation is in; with no product yet, the language of
  the person or of the market they named. Use the correct `lang` and fonts that support its
  script. The cards and the reply are in the conversation's language.
- **Real enough to judge**: true platform sizes (390×844 for a phone, 1280–1440 for a desktop
  page), the states the round needs.

## 7. Look before you show

Before any round reaches the person: render every artboard from its local file, have it judged
against the rubric — by a fresh reviewer when you have a subagent tool, by yourself after
stepping out of the build when you do not, from the source when there is no browser — fix, and
review again, at most twice. The full procedure is `references/critic.md`. The person gets one
line about it, never the report.

Then, **in the reply**: one line on what is on the canvas, the review line, your recommendation
in one sentence, and a prompt for reaction — not a recap of what they can already see.

> Three takes are on the canvas, reviewed before showing (one round of fixes). I'd go with B —
> it finishes the story the hero already tells. You can also mix, say A's receipt with B's
> switch, or ask for something else entirely.

## 8. Iterate

Each round is a new section or row of artboards; **never overwrite** earlier rounds — the
person may want to go back. React to what they say:

- **Pick** → round 2 on that direction (§4).
- **Mix** ("A's colours with B's layout") → one direction stays dominant, the other lends one
  named discipline, never an average (`references/directions.md` §6); plus one alternative mix
  they did not ask for.
- **Push** ("bolder", "calmer") → move the set along that line, plus one that goes the
  opposite way.
- **Others, with no guidance** ("show me others") → the whole set missed: discard every
  direction shown and derive the next set from other families (`references/directions.md` §5).
- **Nothing fits, with a reason** → ask what is wrong with the closest one, then a fresh set.
- **Small tweak** → apply it; do not regenerate everything.

Before you read their reaction, read the canvas: the person may have edited it by hand or turned
the knobs, and those edits are part of their answer.

## 9. When a direction is chosen

**Write the decision down in words.** What was chosen, said as product facts: where the thing
lives, what the user sees, what they can do, what happens in each state the round showed, and
the motion when there is a motion round (its spec table, `references/motion.md` §5). Read the
final knob values from the artboard — on a Design canvas, each tweak's current value is stored
as its declared default — and write them in as concrete values. The mock-up shows it; the words
are the decision.

**Give every major choice its source** — the brief, the product as it is, a reference, a craft
rule. A choice with no source is researched, tied to a constraint, or dropped.

Then, unless you were called from `create-task`, offer one natural next step: a task on the
board through `create-task`, a short hand-off for whoever builds it, or the working frontend
code when you are in the project and the person wants it now.

### A mock-up in a task illustrates it; it never replaces it

When a task comes out of this work — through `create-task` or any other way — the task text is
complete without the mock-up: every decision the round settled is written into it in words,
exactly as it would be if no picture existed. Remove the link and the task reads and works the
same. The mock-up is an addition, like a screenshot: a link on the word that says what it shows
(`the [mock-up](url)`, `see [direction B](url)`), naming the direction and the round when the
canvas holds several.

**Who can open the link.** A published artifact is private to the person by default; the people
who will read the task cannot open it until the person shares it. Before the link goes anywhere,
tell them in one line that the page must be opened for access for the task's readers, and how;
never imply a link works for others when it does not. Files made without a publishing tool are
shared in whichever way is most convenient for the person and the task's readers.

When you were called from `create-task`, take the chosen direction through its gate first —
round 2 and the motion question (§4) — then return the decision and the link to it; it writes
the task.

## Red flags

| Thought or draft | Reality |
|---|---|
| "Three colour schemes of the same layout" | One direction. Different primary axes, different families. |
| The first palette that came to mind | Spent. It is your prior, not a decision. |
| "A dark section with a code window — it's for developers" | The category's default page. Name it as the rut, then derive. |
| A terminal, a cockpit or a ledger as the look of a working screen | A costume of the tool. Take only type, palette, density and one move. |
| "I'll just show them and ask which they like" | Recommend one, with its reason; they confirm or overrule. |
| Showing a round you have not looked at rendered | Review first (§7). Every round. |
| "The critic's points are small, I'll mention them instead" | Fix them, then show. The person chooses; they do not proofread. |
| A reply that presents the round without the review line | The person cannot tell a reviewed round from an unreviewed one. One line, every round (§7). |
| A small change that changes state, shown without the motion question | Ask it in the same message as the round (§4). |
| "Show me others" answered with variants of the same set | The whole set missed. Other families. |
| A mix that lands between the two directions | Averaging. One stays dominant; the other lends one discipline. |
| Invented clients, logos, numbers or testimonials | Never. Marked examples and placeholders only. |
| A badly drawn person, object or scene "for warmth" | Make it well, choose another way, or leave an honest slot. |
| Skipping the motion question because "nothing much moves" | If anything appears, disappears or changes, ask, with your recommendation. Only the person declines. |
| "The product has a design system, but a fresh look is more interesting" | Its language binds. A new look only when they asked for one. |
| "Built from existing blocks / agreed in words / cheap to change — no round needed" | Not yours to waive. A small change gets a small round. |
| Card that says "information architecture" or "primary axis" to the person | Your notes, not their words. Say what a user would notice. |
| "The mock-up shows it, so the task can say less" | The task is complete without it. |
| Putting an artifact link into a task without a word about access | Tell the person it must be shared first. |
| "The `Artifact` tool is here, but a local HTML file is simpler" | The tool is the surface whenever it exists; local files are for review and for agents without one. |
| Overwriting the previous round | A new row; they may want to go back. |
| Leaving the browser window open after looking | Close it as `web-ui-exploratory-qa` Step 10 says. |

## Sources

This skill adapts, in its own words, ideas from Emil Kowalski's animation skills
([emilkowalski/skills](https://github.com/emilkowalski/skills), MIT) and from
[Impeccable](https://github.com/pbakaus/impeccable) (Apache-2.0); see `THIRD_PARTY_NOTICES.md`
at the plugin's root.
