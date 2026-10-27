---
name: design-directions
description: >
  Use when the person wants to design, mock up, redesign or visually iterate on anything —
  app screens, flows, landing pages, dashboards, components, or visual assets such as
  icons, illustrations, banners, social posts and posters — or describes a UI in words
  that would be clearer seen than read ("show me what it could look like", "mock up the
  archive screen", "make an icon for…"). Steers the work onto a visual canvas (a design
  artifact, or the best visual surface present) and always puts several genuinely
  different directions side by side before converging — different answers to the problem,
  not different skins — each with the bet it makes, who it suits and what it gives up, and
  one of them recommended. Grounded in the product as it is: its design system and its
  screens, read in the code or seen in the running product. Also a required step before
  building any visible change in a task (`create-task`, `work-on-task`) unless the person
  declines; a mock-up only illustrates a task, never replacing its text.
---

# Design directions

Turn "make me a screen / a visual / an asset" into **a canvas with several genuinely
different directions**, then iterate with the person until one wins.

Two ideas drive this skill:

1. **Show, don't describe.** If the thing will be judged by looking at it, it belongs on a
   surface the person can see, compare, comment on and edit — not in a paragraph.
2. **Diverge before you converge.** The first idea is rarely the best. Three versions of
   the same layout in different colours is not exploration. Each direction is a
   different *answer to the problem*, not a different skin.

## Who you are working for

The person is most likely the product owner, not a designer or an engineer. They know
what the screen is for and who uses it; they judge by looking, and they should never
have to speak the vocabulary of the craft.

- **The exploration is yours.** The brief, the axes, the divergence, the craft: you
  decide them. Words like "information architecture", "interaction model" or "density"
  stay in your own working notes; what the person reads is what a user would notice.
- **The choice is theirs, and it reaches them recommended.** Every direction is one you
  would defend, and one of them carries your recommendation with its reason in product
  words. They confirm it, pick another, or mix.
- **Facts only they hold are asked once, in product words, with the reason**: the
  address of the product and a login when you need to see it, a brand or a design they
  already have, who the screen is for when nothing tells you. One message, not a drip.

## 1. When to use it

### Required: any visible change in work you are doing

When you create, plan or carry out a task, and the result is something a person will see
in the interface — a new or changed page, screen, dialog, element, block, state, layout,
text or animation — **the round is a required step before any code is written**, not an
offer. The person sees and picks the look on a canvas first, so their feedback lands in
minutes instead of after a whole build; then the chosen direction is built. Size the
round to the change: a few takes on one element for a small change, whole screens for a
new page.

Only two things skip it:

- **A finished design to build as drawn** (a Figma frame, screenshots, a chosen
  direction from an earlier round): the person has already seen the look.
- **The person said so**, in so many words, for this change ("no canvas, just build
  it"). An ignored offer or silence is not a no: ask once more, plainly, and wait.

Never decide it for them. "It is built from blocks the product already has", "we agreed
the shape in words", "it is cheap to change later" and "it is a small change" are not
reasons to skip: what ships is a look the person has not seen, and which look ships is
their decision. Record a skip in the task or the report with their words.

The rest of this section, the offers and "never offer twice", is for ordinary
conversation, where nobody has asked for anything to be built.

**Use directly** when the person asks to design, mock up, wireframe, redesign, "show what
it could look like", or make a visual asset (screen, flow, landing page, dashboard,
component, poster, ad, social post, app icon, illustration, banner, invite).

**Offer it (one short line, then carry on)** when:

- the person describes an interface in words ("there'd be a list with filters on the
  left…");
- a discussion keeps circling around how something should look or behave;
- the person is choosing between layouts, flows or styles in the abstract;
- frontend work is about to start and no design exists yet;
- `create-task` proposes the shape of something new and a picture would settle it faster
  than words.

> Want me to put three quite different takes on this screen side by side, so you can
> compare them before we decide?

Do not hijack: if the person only wants an explanation or a quick inline diagram, do
that. Never offer twice when they ignored the offer. Neither applies to a visible change
you are about to build: that round is required (above).

## 2. Pick the surface (detect, never assume)

Surfaces differ between agents and deployments, and new ones appear. Check which tools
exist in this session and use the first that fits. Never hardcode artifact URLs or ids —
they differ per account.

Claude (Claude Code, the Claude apps) uses its Artifact tool (the `Artifact` tool,
which publishes a page to claude.ai), steps 1–2. **When that tool is in the session, it
is the surface**: never fall back to plain files while it is available — its design
canvas and its shareable page are what this skill is for. Codex and other agents use
their own equivalent of a published visual page or canvas when they have one, following
the same layout rules; otherwise steps 3–4.

1. **An Artifact tool that lists types** (`Artifact`, starting with its `quickstart`
   action, intent `design` — or `slides` for a presentation): it names the types and
   design systems the account has. If a **Design** type
   (a canvas with artboards) is listed, create the work from it and follow the
   instructions it returns. If a **Design System** type is listed and one is marked
   default (or the person names theirs), build with it — unless the product already has
   its own design system, which wins (Section 3). Use **Slides** only when the
   deliverable is a presentation.
2. **An Artifact tool without a fitting type**: one self-contained HTML page laying the
   directions out as equal-size artboards side by side (stacked on narrow screens),
   published as an artifact.
3. **An inline visual tool only**: render the directions inline, one per call with a
   sentence of framing between them; say that a canvas would let the person keep and
   edit them.
4. **No visual tool**: plain HTML, CSS and JavaScript files, self-contained (no external
   dependencies beyond CDNs and web fonts); tell the person how to open them in a
   browser.

If the person named a tool or a format (Figma, a `.png`, a `.pptx`), use that and skip
this ladder.

## 3. The product first, then the brief

Most of the time the product already exists, and a direction that ignores it is a
direction nobody can ship. Before the first artboard, find out what the new thing must
live next to:

- **In the code, when you are in the project (read-only)**: the design tokens (colours,
  type, radii, spacing), the components the screens are built from, the screens next to
  the one being designed, the product's own design guidance if the repository has one.
- **In the running product, when there is no code**: look at it through a browser. The
  browser mechanics are those of the `web-ui-exploratory-qa` skill in this plugin — **its
  "The browser: Playwright CLI, and nothing else" section for opening the product,
  its Step 7 for capturing a screen properly, and its Step 10 for closing the browser
  when you are done.** Read those sections and follow them. Its lenses, its loop, its
  artefact folder and its fix protocol are not yours: you are looking, not auditing, and
  you change nothing.
- **A new product, or a person with no product yet**: nothing to inherit; the style axes
  are open (Section 4).

**What this means for divergence.** When the product has a design language, it is fixed:
every direction uses its colours, type and components, and the directions diverge on
structure and behaviour only. A direction in a style the product does not have is a
redesign, and it appears only when the person asked for one.

Then the **minimum brief**, extracted from the conversation, not interrogated:

- **Goal** — what the screen or asset must achieve; its one primary action.
- **Audience and context** — who, on what device, in what situation (on the go, at a
  desk, in a hurry, browsing).
- **Real content** — actual labels, data, copy. Invent realistic content when none is
  given; never lorem ipsum.
- **Constraints** — platform, brand or design system, accessibility, the screens to stay
  consistent with.

If something critical is missing **and** a wrong guess would waste the whole round, ask
at most one or two questions. Otherwise state your assumptions in one line at the top and
start.

## 4. The divergence protocol (the core)

### 4.1 How many

Default **three directions**. Two when the space is tight (a strict design system, a
small screen); up to five when the person asks for "lots of options" or the problem is
wide open. In early rounds one of them may be a deliberate **wildcard**.

### 4.2 The axes

Directions differ on **structure and behaviour**, not only on style. Structural axes:

| Axis | Example poles |
|---|---|
| Interaction model | browse · search-first · conversational · guided wizard · direct manipulation · command palette |
| Information architecture | single scroll · progressive disclosure · hub and spoke · dashboard overview · feed · canvas/spatial |
| Navigation | bottom tabs · sidebar · gestures/cards · contextual only · no-nav linear flow |
| Primary action placement | hero call to action · persistent floating button · inline per item · ambient/automatic (no button at all) |
| Density | one thing per screen · balanced · power-user dense |
| Content hierarchy | data-first · action-first · narrative-first · visual/media-first |
| Input modality | tap/forms · voice · drag · keyboard-first · zero-input (smart defaults) |

Style axes (vary them when the product leaves them open; they never count alone):

| Axis | Example poles |
|---|---|
| Visual language | editorial/type-led · brutalist · soft/tactile · utilitarian/system · playful/illustrated · luxury/minimal |
| Colour strategy | monochrome + one accent · full brand colour · content-coloured · dark-first |
| Motion and feedback | static · subtle · expressive/game-like |
| Voice of copy | neutral · warm/coach · witty · terse/pro |

### 4.3 The rule

**Every pair of directions differs on at least three structural axes.** Before building,
write a short divergence table (direction × axes) for yourself; if two rows look alike,
replace one. Only then vary the style axes the product leaves open, so each direction's
look reinforces its idea.

### 4.4 Archetypes to borrow from

Starting points; mix them or invent better ones:

- **The Concierge** — conversational; the UI asks and adapts, minimal chrome.
- **The Cockpit** — dense overview for experts, everything at a glance, keyboard
  shortcuts.
- **The Single Next Step** — one card, one action, nothing else; momentum over overview.
- **The Magazine** — editorial layout, big type, story-driven, content as hero.
- **The Canvas** — spatial, drag-and-drop; the user arranges things themselves.
- **The Feed** — infinite, swipeable, low effort per item.
- **The Wizard** — linear steps with clear progress, for anxious or first-time users.
- **The Ambient** — mostly automatic; shows only exceptions and confirmations.
- **The Game** — progress, streaks, tactile feedback, playful motion.
- **The Tool** — utilitarian, system-native, gets out of the way.
- **The Search Bar** — one input that does everything; the results are the UI.
- **The Contrarian** — deliberately breaks one strong convention of the category and owns
  it.

Example — "home screen for a habit tracker":

- A) *Single Next Step* — one huge card "Drink water (2/8)", swipe to complete, no list.
- B) *Cockpit* — week heatmap of all habits, stats, filter bar, inline toggles.
- C) *Concierge* — a morning check-in conversation that logs habits from short replies.

These differ in interaction model, structure, navigation, action placement and density —
not just in colour.

### 4.5 Visual assets (icons, illustrations, posts, posters, banners)

Diverge on **concept** first, then on form:

- **Metaphor / idea** — literal · symbolic · abstract · typographic · character-based.
- **Composition** — centred hero · asymmetric · pattern/tile · frame within a frame ·
  full-bleed.
- **Medium / rendering** — flat vector · 3D/soft · hand-drawn · photo-collage · pixel ·
  pure type.

When the product already has an illustration or icon style, it is fixed the way a design
system is: the directions diverge on concept and composition inside it. Keep the format
identical across directions (same size, same safe area) so the comparison is fair. Never
reproduce known characters, logos, brand mascots or existing artworks — not even "in a
different style".

## 5. Build and present

- **Same content, same frame size** in every direction — the person compares ideas, not
  data.
- Name each direction evocatively ("A — Single Next Step") and give it a short card:
  - **The bet** — one sentence: what this direction wagers on.
  - **Best for** — which user or situation it wins.
  - **Gives up** — what it trades away. When it breaks a platform convention or the
    product's own patterns, say so here.
  - On exactly one card: **Recommended** — why, in one clause about the product.
- **Where the card lives**: outside the design, so the artboard stays a clean, editable
  design. On a canvas, a note next to (e.g. under) its artboard; with no notes, a caption
  beside the frame or the reply. Never bake rationale into the mock-up.
- **Language.** Text inside the mock-up is in the product's language — an English
  product gets English labels whatever language the conversation is in; with no product
  yet, the language of the person or of the market they named. Use the correct `lang`
  and fonts that support its script. The cards and the reply are in the conversation's
  language.
- **Real enough to judge**: realistic copy, true platform sizes (390×844 for a phone),
  readable contrast (WCAG AA), the states that matter (empty, loading, error, success).
  For a flow, two or three key screens per direction rather than one.
- **In the reply**: one line on what is on the canvas, your recommendation in one
  sentence, and a prompt for reaction — not a recap of what they can already see.

> Which one feels closest? I would go with B — it keeps the list everyone already knows.
> You can also mix, say A's single action with B's week overview, or tell me which to
> push further.

## 6. Iterate

Each round is a new section or row of artboards; **never overwrite** earlier rounds — the
person may want to go back.

React to what they say:

- **Pick** → refine that one: polish, add the states and the remaining key screens. For
  anything whose value is in how it *feels* to use — onboarding, gestures, games, playful
  products — turn the chosen direction into a **clickable prototype** in this round
  (working buttons, state changes, links between screens, simple feedback), not another
  static comp.
- **Mix** ("A's navigation with C's tone") → build the hybrid, and one alternative hybrid
  they did not ask for.
- **Push** ("make it bolder") → take the chosen direction further along its own axes,
  plus one that goes the opposite way.
- **Nothing fits** → ask what is wrong with the closest one, then a fresh set that differs
  from *all* previous directions on the structural axes.
- **Small tweak** → just apply it; do not regenerate everything.

Keep one wildcard in early rounds; drop it once the person is converging.

## 7. When a direction is chosen

**Write the decision down in words.** What was chosen, said as product facts: where the
thing lives, what the user sees, what they can do, what happens in each state the round
showed. The mock-up shows it; the words are the decision.

Then, unless you were called from `create-task`, offer one natural next step: a task on
the board through `create-task`, a short hand-off for whoever builds it, or the working
frontend code when you are in the project and the person wants it now.

### A mock-up in a task illustrates it; it never replaces it

When a task comes out of this work — through `create-task` or any other way — the task
text is complete without the mock-up: every decision the round settled is written into
it in words, exactly as it would be if no picture existed. Remove the link and the task
reads and works the same. The mock-up is an addition, like a screenshot: a link on the
word that says what it shows (`the [mock-up](url)`, `see [direction B](url)`), naming
the direction and the round when the canvas holds several.

**Who can open the link.** A published artifact is private to the person by default; the
people who will read the task cannot open it until the person shares it. Before the link
goes anywhere, tell them in one line that the page must be opened for access for the
task's readers, and how; never imply a link works for others when it does not. Files
made without a publishing tool are shared in whichever way is most convenient for the
person and the task's readers, so that the readers can open them.

When you were called from `create-task`, return the decision and the link to it; it
writes the task.

## 8. Don'ts

- Don't present "light / dark / colourful" or "minimal / modern / bold" as different
  directions.
- Don't make one obviously good option and two strawmen — each direction must be a
  version you would defend.
- Don't leave the choice bare: one direction is recommended, with its reason.
- Don't invent a new visual language for a product that has one, unless the person asked
  for a redesign.
- Don't use lorem ipsum, grey boxes everywhere, or placeholder "Image" rectangles when a
  shape, an illustration or real text would do.
- Don't describe the designs at length in chat; the canvas is the answer.
- Don't hardcode artifact ids, account-specific URLs, or a brand the person did not give
  you.
- Don't build before you have the divergence table; don't skip it on later rounds.

## Red flags

| Thought or draft | Reality |
|---|---|
| "Three colour schemes of the same layout" | One direction. Diverge on at least three structural axes. |
| "I'll just show them and ask which they like" | Recommend one, with its reason; they confirm or overrule. |
| A card that says "information architecture" or "interaction model" to the person | Your notes, not their words. Say what a user would notice. |
| "The product has a design system, but a fresh look is more interesting" | Its language is fixed; diverge on structure. A new style only on a redesign request. |
| Designing a screen of an existing product without looking at it | Read the code or open the product first (Section 3). |
| "The mock-up shows it, so the task can say less" | The task is complete without it. The mock-up only illustrates. |
| Putting an artifact link into a task without a word about access | Tell the person it must be shared first. |
| "The `Artifact` tool is here, but a local HTML file is simpler" | The tool is the surface whenever it exists; files are the fallback for agents without one. |
| Overwriting the previous round | A new row; they may want to go back. |
| Offering the canvas again after they ignored it | Once is the limit in conversation; before building a visible change, ask again and wait. |
| "Built from existing blocks / agreed in words / cheap to change — no round needed" | Not yours to waive. The round is required before building; only the person skips it. |
| "Too small a change for a canvas" | Make the round small (a few takes on that element), not absent. |
| Leaving the browser window open after looking | Close it as `web-ui-exploratory-qa` Step 10 says. |
