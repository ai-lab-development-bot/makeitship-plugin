---
name: web-ui-exploratory-qa
description: >
  Use when the user asks to visually check, QA, compare against Figma, or explore a
  screen, component, or state of a running web app in a browser: "check this page
  against the design", "QA the billing screen", "compare the sidebar with Figma", "run
  UI exploratory QA", "does this screen match the design", "test it on mobile", "is the
  layout broken at other widths". An exploratory pass, not pixel-perfect verification:
  the agent examines each screen the way an experienced tester would — what a person
  would notice, how it behaves, where it breaks — and catches what is obvious to a
  human eye. A compare-and-fix loop over a web app in a real browser: the person picks
  the mode (Figma MCP or exploratory) up front from a plain description of both, then
  the agent captures each target from Figma (in Figma mode) and from the running app
  through the Chrome DevTools MCP, compares, fixes the obvious on its own, and
  escalates the rest as defect propositions that each carry a proposed fix and its
  consequence for users. It never switches mode on its own and reports in the language
  of the conversation. Project-agnostic; the Figma file is asked for each run.
---

# Web UI Exploratory QA

An **autonomous compare-and-fix loop**: pick a target, capture it from **Figma** (in
Figma mode) and from **Chrome**, compare, then fix it yourself or escalate it with a
proposed fix. What makes this skill different from a plain visual check is the
**auto-fix philosophy** (Step 4): whatever the product was already supposed to do is
fixed on the spot and proven, in whichever layer the cause lives; whatever changes what
the product should do is escalated, always with a proposition, never as a bare
question. Nothing is ever committed.

**Not exhaustive.** Catch what is obvious to a human eye — critical, high and medium
impact. Pixel-perfect fidelity, sub-pixel spacing, font rendering nuances, hover states
on mobile and accessibility are out of scope unless asked for. The latest Chrome on this
machine is the whole environment matrix.

**Write for a non-technical reader.** Defects describe what the user sees ("the Save
button does nothing"), never the internal cause — that belongs only in the *Proposed
fix* line.

## Who you are working for

The person running this loop owns the product. They know what a screen is for and what
a customer should be able to do on it; they do not know what MCP, emulation, a token or
a breakpoint is, and they should never have to. Every choice this skill contains is
yours to make and theirs only to confirm, stated in the terms of their product:

- **The decision** — one line, about the product: "I will compare the screens against
  your Figma file, so anything that differs from the design counts as a finding."
- **What it means for them** — what they get and what they give up: "without the
  design I can only judge by experience, so 'does not match the design' will not
  appear in the report; everything else is checked the same way."
- **What they need to do** — confirm, or say no.

Never "which environment?", never "which tracker?", never "MCP or stub?" as a bare
question. Recommend one, say why in product terms, and let them confirm the
consequence rather than pick the mechanism. The exceptions are facts only they hold —
whether a design exists for these screens, the Figma file URL, a login, what the
product knowingly lacks — and those are asked once, in one message, in product words,
with the reason the run needs them. The mode (Step 1) is the first of these: the agent
cannot know whether a design exists, so it describes both modes and lets them choose.
Every escalated defect follows the same rule: it is a decision ready to take, with the
proposed fix and what users would notice either way, never an open question.

**Language — hard requirement.** `defects.md`, `targets.md` and every message in the
chat are written in the language the user is conversing in. Only identifiers stay as
they are: file names, target ids, field labels of the template, tool names. A report
written in another language is rewritten before it is posted or saved.

## Step 1 — The mode is the user's choice, made first from a plain description

Before any other action — before opening a page, before checking any tool — stop and
describe the two modes in product terms, then wait for the choice. Whether a design
exists for these screens is a fact only the user holds: the repository may carry no
trace of a Figma file that exists, or a stale trace of one that no longer applies, so
the agent never infers the answer and never skips the question.

> *"This check runs in one of two ways — which one fits this round?*
> *— **Against the design**: I compare every screen with your Figma file, so anything
> that drifted from the design is caught, not only what looks broken. I will need the
> file link.*
> *— **By experience**: there is no design to compare with, so I judge each screen
> the way an experienced tester would — broken, confusing or unfinished is still
> caught, but nothing will be reported as 'differs from the design'."*

Both options, each with what it gives and what it does not, and the user picks. When
the request or the repository shows a sign of a design (a Figma URL, a design skill, a
tokens reference), say so in the same message as a hint — "I see a Figma link in the
project; if that is the current design, the first option is the stronger check" — and
still let them choose; a hint is not a default. The agent does not probe Figma to
decide, and does not start on its own. **Nothing starts until the choice is
explicit.** A mode named in the request itself ("compare with Figma", "no design, just
explore") counts as the choice; anything less does not.

**The answer fixes the mode for the whole iteration.** There is no automatic switching
in either direction:

- **Figma mode chosen** → Figma is *required*. Do the full setup below. If Figma still
  does not answer after it, **stop and ask** (see *When Figma does not answer*). Never
  drop into exploratory mode because Figma was hard.
- **Exploratory mode chosen** → say plainly that nothing will be filed as "does not
  match the design", and go to Step 2.

The chosen mode, who chose it, and any change to it later are written in the scope
block of `targets.md` and repeated in the Step 9 summary. A mode change mid-run is a
user decision recorded with its reason ("Figma up to the Billing screen, exploratory
from there — user decision, Figma file lost access"); the report always says which
approach was applied to what.

### Figma MCP setup (Figma mode only)

Help with every step the user cannot do alone. Its tools appear as
`mcp__plugin_figma_figma__*`.

1. **Are the tools present in this session?** Call `whoami` or `get_metadata`. If
   they answer, go to 4.
2. **Not present → install**: `/plugin install figma@claude-plugins-official`, sign in
   when the plugin asks.
3. **After an install the tools are still absent in this session — expect it, it is
   normal.** MCP servers connect when a session starts, so a plugin installed mid-session
   is not wired up yet. This is the single most common first-time problem; do not
   debug it as anything else. Walk the user through it, cheapest first:
   1. Ask them to run `/reload-plugins` in this same window, then call `whoami` again.
   2. If the tools are still absent, explain in one sentence that the session has to
      restart for the MCP to connect, and that the context is kept. Give them exactly:

      ```
      /exit
      claude --continue
      ```

      (`claude -c` is the same thing; `claude --resume` picks a session from a list.)
      After they are back, call `whoami` again yourself and continue from where the
      run was — `targets.md`, if already written, is on disk.
   3. If a Figma sign-in prompt appears after the restart, have them complete it,
      then check again.
4. **Tools answer but the file does not** ("not found", "no access", 403): that is a
   file-access problem, not a setup one. Confirm the file URL and that the signed-in
   Figma account can open it in the browser.
5. **Which file?** Ask for a file URL or a node URL every run; the skill carries no
   stored file key. Node ids in a URL use `-`, the API uses `:`. Verify with a
   `get_metadata` call on the file.
6. **Which theme, and what to ignore?** Look at the frames and say which theme they
   are drawn in ("the design is in light mode, so I compare the light screens; dark
   mode is checked by experience only") and get that confirmed. Then ask, once, whether
   any part of the file is not the real design — superseded studies, scratch boards —
   because only they know that. Record both in the scope block.

### When Figma does not answer

If, after the setup above, Figma MCP still does not work: **stop.** Tell the user, in
plain words, what exactly failed and what was tried (install, reload, restart, sign-in,
file access), then recommend one way forward with its consequence:

> *"I cannot reach your Figma file right now. I recommend running this pass by
> experience instead: everything broken, confusing or unfinished is still caught, but
> nothing will be reported as 'differs from the design' — that comparison can be a
> second pass once Figma works. Shall I go ahead that way, or would you rather we fix
> the connection first?"*

The run waits for the answer. The switch happens only on the user's confirmation,
never on the agent's own, and it goes into `targets.md` with the reason.

### The browser: Chrome DevTools MCP, and nothing else

**This is a hard requirement, not a preference.** Every navigation, emulation,
snapshot, click, form fill, script evaluation and screenshot in this skill goes through
its tools (`mcp__plugin_chrome-devtools-mcp_chrome-devtools__*`). Playwright MCP, a
Vitest browser run, `curl`, a headless script, a screenshot the user pastes, or "I looked
at the code instead" are **not substitutes** — a run that uses any of them is not a run
of this skill and must not be reported as one.

Before the first page opens, **prove the MCP is alive**: call `list_pages` (or
`new_page`) and get a real answer. If the tools are absent or fail:

1. install — `/plugin marketplace add ChromeDevTools/chrome-devtools-mcp`, then
   `/plugin install chrome-devtools-mcp@chrome-devtools-plugins`; the same
   `/reload-plugins` → `/exit` + `claude --continue` sequence as for Figma applies;
2. if it still does not answer, **stop**. Tell the user in plain words what is missing
   and what to try (a stuck Chrome, a stale plugin, a session that needs restarting).
   Do not start the iteration, do not capture anything by another route, do not offer
   a "lighter" run. Testing resumes only when the DevTools MCP answers.

**If the user has never heard of either tool**, point them here — these are the
sources of truth for setup, and the agent reads them too when an install goes wrong:

| Tool | Documentation | Needs |
|---|---|---|
| Chrome DevTools MCP | https://github.com/ChromeDevTools/chrome-devtools-mcp | Node.js LTS, current stable Chrome, npm |
| Figma MCP | https://help.figma.com/hc/en-us/articles/32132100833559 and https://github.com/figma/mcp-server-guide | a Figma account with access to the file |
| Claude Code plugins (how `/plugin` works) | https://code.claude.com/docs/en/plugins | — |
| Claude Code MCP (manual setup without a plugin) | https://code.claude.com/docs/en/mcp | — |

The plugin commands above are the fast path. If the plugin marketplace is unavailable,
the MCP docs page shows how to add the same server by hand with `claude mcp add`.

## Step 2 — Scope, and do we have everything?

Settle these before opening the first page, and write them at the top of `targets.md`:

- **Mode** — Figma or exploratory, and that the user chose it (Step 1). In Figma mode:
  the file URL, the canonical theme, the ignored nodes.
- **Themes** — which ones the app offers and how it switches (a control, the system
  setting, both). Both are always in scope: the canonical one gets the frame
  comparison, the other one Lens 1's second pass. An app with one theme says so here.
- **Scope** — which screens, components, states, viewports. Cap the target list at
  roughly a dozen per screen and state the cap.
- **Environment** — recommend the one with safe demo data, say why ("I will click,
  submit and create records; on a staging copy none of that reaches customers"), and
  get it confirmed (one named in the request counts). On **production** the loop is
  read-only: no auto-fix, no interaction that writes — say so, as the consequence of
  choosing it.
- **Login** — a role that can see the screens under test; say which.
- **Out of scope** — what the design draws that the product knowingly lacks. An absence
  on that list is never a defect.
- **Design-system sources** — where the project's tokens and styling rules live, read
  before the first auto-fix. Find them in the repo (a design skill under
  `.claude/skills/`, a tokens stylesheet, a design-system doc) and state what you
  found and what it allows: "the project has its colour and spacing rules written
  down, so I can correct a wrong colour myself without inventing one." If there is
  none, say so and what it means: **no source = no auto-fix** — every style deviation
  is proposed, not fixed, so the report will be longer and nothing is changed without
  them.

Everything about running the app, its URL, seed data, the quality gate and issue
tracking is the project's own setup. **Assume it exists** and find it in the repo
(README, CLAUDE.md, package scripts). When something genuinely blocks — the app is not
running, no login works, a command is missing — say so plainly and either fix it in the
session or ask the user to. Never hardcode a workaround into this skill.

**Per target, Figma may still be missing** — a state the file does not draw, a screen
that was never designed, a node that is only a study. Those targets go through the same
four lenses (Step 3), with Lens 1 judged by good sense instead of a frame. Mark them `Figma node: —`. That is
a per-target gap, not a mode switch, and the ledger says so.

## Step 2.5 — Context before the first look

Before opening a target, learn what it is *supposed* to do. Cheap, and it makes every
*Expected* line in a defect trustworthy.

- If the project has a docs index (`docs/INDEX.md`, or one level deeper in a monorepo),
  read it and load the two or three docs that describe the screens in scope. No index →
  skip silently; never let missing docs block a run.
- Otherwise read what the repo offers about the screen: the route file, the page
  component's props and states, the translation strings it renders.
- Treat what you read as **hypotheses, not authority.** A doc that says "the list shows
  an empty state" is a claim to verify on the screen; if the screen disagrees, that is
  a finding (which of the two is stale goes into *Why it counts*).
- Never load plans or specs of unbuilt work as a reference for what exists.

## Step 3 — Senior exploratory mode: four lenses, one at a time

Think like a **genuinely experienced** exploratory QA engineer — years of shipped
products, not a checklist reader. Every target, with or without a frame, is examined
through **four lenses applied sequentially**: one lens active at a time, the whole
target under it, then the next. Looking through all of them at once is how the
functional and edge-case defects get missed while the eye is on the pixels. The ledger's
Notes record which lenses a target has been through.

#### Lens 1 — Look (visual)

*Would a careful person accept this screen at this width?*

In Figma mode this is the frame comparison; without a frame it is composition by good
sense. Flag: anything cut off, overlapping, misaligned, unreadable, wrapping onto an
icon, scrolling sideways, an image scaled wrong, a control below the fold on a phone,
a token-level deviation the frame settles (colour, spacing, radius, weight).

##### Lens 1, second pass — the other theme

*Does the screen hold up when the theme flips?*

Most apps ship a light and a dark theme, and the second theme is where design systems
rot: a value hardcoded in one component while everything around it follows the tokens,
a token whose dark value was guessed, a theme added late by a generated patch that
covered the common surfaces and missed the rest. **Every target is captured in both
themes**; the canonical theme (Step 2) gets the frame comparison, the other one gets
this pass. Switch through the app's own control; if the app follows the system
setting, use the DevTools MCP's colour-scheme emulation when it offers it, otherwise
set the attribute or class the app reads (`evaluate_script`) and verify the page
actually changed before capturing. Target ids carry the theme as part of the state
(`billing@1440--default--dark`).

Flag, in the terms a user would notice:

- **A surface that did not switch** — a white card, panel, dropdown, tooltip, drawer or
  dialog on a dark page, or the reverse; a native control (select, date picker,
  scrollbar, checkbox) in the wrong scheme because `color-scheme` was never set.
- **Text that is hard or impossible to read** — low contrast against its background,
  placeholder or helper text that vanished, text inside a coloured badge, chip or
  button that kept the light-theme colour; a disabled state indistinguishable from an
  enabled one.
- **Structure that disappeared** — borders, dividers, table lines and input outlines
  that were visible in one theme and gone in the other; a shadow that carried the
  depth in light mode with nothing replacing it in dark mode, so cards merge into the
  page.
- **Images and marks** — a logo, illustration, screenshot, favicon or chart with a
  baked-in white background or an invisible dark line; an icon that does not follow
  the text colour next to it; an empty-state or error illustration drawn for one theme.
- **States that lost their meaning** — hover, selected, active, focus ring and error
  colours that look the same in the second theme, or a status colour (success,
  warning, danger) that reads as a different status.
- **Theme behaviour itself** — a flash of the wrong theme on load or on navigation; a
  choice that does not survive a reload, a new tab or a sign-in; an overlay or
  skeleton whose transparency assumed one background; a third-party embed (map,
  payment form, chat widget) that stays in its own theme with no frame around it.

**Token or component — decide before bucketing.** Trace the deviation to its source in
the design-system sources (Step 2): a component that hardcoded a value, or used the
wrong token, while the right token exists is a *component* slip — the first bucket, one
component, fixed and proven in both themes. A token whose value is wrong in one theme
is a *design-system* defect: changing it moves every screen that uses it, so it is
escalated, once, as one entry — *Screens: every screen with <token>* — with the
proposed value, where it was found, and what users would see change across the product.
Never patch a wrong token around in one component; that hides the defect and adds a
second one.

**Follow the cluster harder here than anywhere.** A theme defect is almost never
alone: one card without a dark surface means every card from the same source; one
badge with light-theme text means every badge. Check the siblings before the next
target, and name the family in the entry rather than filing each instance.

#### Lens 2 — Act (functional)

*Does every interactive element do what it promises?*

Snapshot the interactive elements, act on each, snapshot again. Flag: a control that
does nothing or does the wrong thing; a submit that can be sent twice; a dialog that
does not close, or closes without restoring focus; a flow that cannot be resumed after
cancel, close, navigate-away-and-back, or the browser's Back button; a second click on
a control already working; data another user should not see reachable by editing the
URL; sensitive values shown where they should be masked.

#### Lens 3 — Push (states and data edges)

*What does the screen do at the boundaries of its data?*

Try every reachable state and edge: empty / one / many / too many; the first and the
last item; the longest name, the widest number, zero and negative, unusual characters
in every text field; the loading state, the error state from the server, the offline
state, the expired session. Flag: a state with no design (blank area, raw error, a
spinner that never ends), a state that breaks the layout, a value that is silently
truncated, clamped or mis-formatted, a state the user cannot get out of.

#### Lens 4 — Feel (non-functional)

*Does it behave like a finished product?*

Flag: a slow response with no indicator; a layout that jumps while loading; a
transition that stutters or captures a half-drawn frame; a dialog that keyboard-only
users cannot get through or out of; a console error or warning with a visible or
plausible effect; a page that does not survive a resize mid-flow.

#### Then: step back

After the four lenses, before writing anything, one more pass with no lens:

- **Conspicuous absences** — what you expected on this screen and did not find (a
  confirmation, an empty state, a way back, a loading indicator).
- **Inconsistency with the rest of the product** — this screen does something its
  siblings do differently (a dialog that closes on Escape everywhere but here).
- **The thing that felt off** and belonged to no lens. Name it anyway.

For each finding, in every lens:

1. **Say what the target is for** — one sentence in the ledger's Notes, from Step 2.5.
2. **Decide, and say why.** Every finding gets a one-line reason it counts as a defect
   ("the primary action is below the fold on a phone", "the label wraps onto the icon").
   A judgement without a reason is not a finding.
3. **Weigh it.** A senior files the thing that will embarrass the product and skips the
   thing nobody will notice. The noise a junior would file is left out.
4. **Follow the cluster.** One finding suggests its family: a truncation on one card
   means checking every card with variable text; one dialog that does not restore focus
   means checking every dialog. Dig into the same section, its siblings and its other
   states before touching the next target.

## Step 4 — The auto-fix philosophy

Every claim goes in exactly one bucket. When two fit, the more conservative one.

| Bucket | The finding is… | Action |
|---|---|---|
| **Fix it yourself** | **technical**: what the product should do here is already settled — by the frame, the docs, the product's own sibling screens, a stated intent in the code — and the fix makes it do that. A wrong token or hardcoded value; a missing hover or focus treatment; a layout the frame settles; a control that does nothing because a handler was never wired; a dialog that does not close because the state never resets; a route that drops its query on Back; a list that shows stale data because the cache is not invalidated; a request that sends twice; a server handler that returns the wrong status for an input the contract already defines; a console error with a traceable cause. The layer does not matter — markup, style, state, hooks, routing, server code — the settled intent does | recommend → research → apply → verify → record (the protocol below); log it under *Fixed by agent* in `defects.md` |
| **Escalate with a proposition** | **business**: resolving it requires deciding what the product *should* do — a behaviour nothing settles, a rule, a threshold, a default, copy, who may see or do what, which of two disagreeing sources is the truth, a component the design never drew; or a technical fix whose research did not converge, spreads beyond the finding, or would change observable behaviour after all | write the defect entry **with a concrete proposed fix** (Step 8), then ask the user to decide |
| **Not a defect** | out of scope · a design gap · a non-canonical theme or ignored node · content length · a gap from capturing too early | drop; note it in the ledger's Notes so it is not re-raised |

**The one rule behind the buckets:** a finding is yours to fix when the fix changes
nothing about **what the product is supposed to do** — it only makes the product do
it. The test is not which file you would touch, nor how many lines: a screen defect
is very often the visible end of a state, routing or server slip, and that slip is
yours when the intended behaviour is already on record. The moment the fix would
decide a behaviour — what a user sees, receives or can do that nothing has settled —
it is an escalation, however small the edit; and "it is a one-line change" never
moves a finding into the first bucket.

**When in doubt, escalate.** But escalating is not asking a question — it is handing the
user a decision that is ready to take: what is wrong, why it counts, what you would
change and where, what customers would notice after the change, and what the risk is.
Recommend applying it or not, and say so in the entry. And it is a proposition, not an
accusation: assume there was a product reason, and name the one you suspect ("the list
hides items past 50 with no indicator — if that is a deliberate cap, a 'showing 50 of
120' line makes it visible; if it is a leftover, the cap goes").

**Never on your own, whatever the layer:** deciding a behaviour nothing has settled;
changing copy; changing what data a role may see; anything on a read-only
environment; a second visit to a file this run without re-reading it. These are not
layers — they are the places where the fix would be a product decision.

**Protocol for a self-fix** — a sequence, never a single edit:

1. **Recommend** — one or two sentences: what is wrong, where the cause is, what the
   change is, and what settles the intended behaviour (the frame, the doc, the
   sibling screen, the stated intent). No settled source → it is business; escalate.
2. **Research** — read the cause, not just the symptom: follow the control to its
   handler, the state to where it is set, the request to the server code. Match how
   the rest of the project already solves the same concern (an adjacent component, a
   test, the project's conventions); a style value comes from the design-system
   sources, never invented. If the research does not converge on one change, or the
   change would spread beyond the finding, stop and escalate with what you found.
3. **Apply** — a surgical edit at the cause, not a patch over the symptom.
4. **Verify** — re-capture to `browser/<id>--after.png` and compare; exercise the
   same interaction again (Lens 2) when the fix was behavioural; run the project's
   own quality gate (lint, typecheck, the tests that cover the touched area, as the
   repo defines it). A fix that does not show, or a red check, is **reverted — your
   own edit only, never `git checkout`** — and escalated with the evidence.
5. **Record** — log it under *Fixed by agent*: the change, the files, the proof, and
   what settled the intent.

Downgrade a fix to an escalation, with the reason, whenever research does not
converge, the change spreads beyond the finding, verification fails for a reason other
than the change itself, or applying it would after all change what a user can do.
**Never commit, never push.**

**Escalations the user approves** are applied the same way — edit, re-capture, prove,
log — and recorded in the final table as *fixed from escalation*.

## Step 5 — The artefact folder

One dated folder per run under `ui-exploratory-qa/` at the project root. Nothing else
is written except source files a fix touches. **Never commit it**; check `git status`
before any `git add` in a session that ran this skill.

```
ui-exploratory-qa/<YYYY-MM-DD>-<scope-slug>/
  targets.md                 # THE LEDGER — scope header + one row per target, updated every cycle
  defects.md                 # THE RESULT — Fixed table, then the numbered Escalated list
  figma/<target-id>.png      # design side (Figma mode)
  browser/<target-id>.png    # built side; <target-id>--after.png proves a fix
```

Three files, no more. `targets.md` opens with the scope block from Step 2 (mode and who
chose it, environment, login, out-of-scope list, design-system sources, budget) and is
followed by the ledger; a `Notes` column carries what a run log would ("clean",
"finding → #4", "blocked: emulation failed"). `defects.md` is the one file the user
reads.

Save every screenshot with `take_screenshot`'s `filePath` **as a path relative to the
project root** (`ui-exploratory-qa/<run>/browser/<id>.png`). The MCP refuses any path
outside the workspace, so a scratch or temp directory fails with "Access denied".

Target id = `<screen-or-component>@<width>--<state>`, e.g. `billing@1440--default`,
`nav@375--drawer-open`; the other theme appends `--dark` or `--light`
(`billing@1440--default--dark`). Same id in both folders, so a pair or a missing half
is obvious.

## Step 6 — The loop

Write the ledger before the first capture: `| # | Target id | Kind | Route / how to reach | Figma node | Status | Notes |`.
Choose targets in this order: screens whose code changed most recently (ask, or `git
log`) → each in-scope screen at its desktop and mobile frame widths → the states the
design draws (dialogs, drawers, in-progress; find them with `get_metadata`) → kit
components when the screen pass raised a suspicion → states the design does not draw.

**Defects cluster — 80% of them live in 20% of the functionality.** This governs the
loop in every mode, Figma or not:

- **Start where defects are likeliest**: the newest code, the most complex
  interaction, the section with the most states, the place a previous run found
  something.
- **When a target yields a finding, stay there.** Enqueue that section's sibling
  elements, its other states and its other widths as the *next* rows, ahead of anything
  already in the ledger. A second finding in the same place confirms the cluster;
  spend the budget on it.
- **A clean target buys its neighbours a lighter pass.** Two clean targets in a row in
  one section mean the section is probably clean; move on rather than exhaust it.
- **Record the clusters.** The summary in `defects.md` names where the findings
  concentrated, so the next run starts there.

**Cycle** per `todo` row: capture design (Step 7, Figma mode) → capture built (Step 7)
→ run the four lenses and the step-back pass (Step 3; in Figma mode Lens 1 is the
frame comparison) → switch to the other theme, re-capture, run Lens 1's second pass
(and Lens 2 only where a control's look carries its meaning) → write each finding as a
*claim* ("the card border is missing on the left column") → bucket each claim (Step 4)
→ act → update Status
(`done` / `fixed` / `escalated` / `blocked`) and fill its Notes → enqueue any
state discovered while interacting — **at the top of the ledger if the target had a
finding**, at the bottom if it was clean.

**Stop** when the ledger is empty, the budget is spent, two consecutive cycles found
nothing new, or **the same target failed twice** — escalate it, never a third try.
Report to the user at the end of each screen, not only at the end of the run.

## Step 7 — Capturing both sides

**Figma** — `get_screenshot({ fileKey, nodeId, maxDimension })`. The default 1024
flattens small text: ask for at least the node's natural width, double it for a small
detail, re-request if `original_width` shows clamping. `curl` the PNG into
`figma/<id>.png` and `Read` it; never judge from the thumbnail or the JSX
`get_design_context` returns. `get_metadata` finds the sub-node behind a claim.
**Emulate the frame's own width**, read from `original_width`.

**Chrome** — `emulate` viewport format `<width>x<height>x<dpr>[,mobile][,touch]`.

| Device | Frame width first | Then a quick pass at | Emulation |
|---|---|---|---|
| Desktop | 1440 | 1280 · 1536 · 1920 · 2560 | `1440x900x1` |
| Mobile | 375 | 360 · 390 · 393 · 414 · 430 | `375x812x3,mobile,touch` |
| Tablet | 768 | 810 · 1024 | `768x1024x2,mobile,touch` |

**A mobile or tablet capture without `mobile,touch` is invalid — hard requirement.**
A narrow desktop window is not a phone: it still answers `pointer: fine` and
`hover: hover`, so hover-only controls look fine, scrollbars steal width, the meta
viewport is handled the desktop way, and touch-only defects never appear. Keep both
flags at tablet widths too; never apply a phone preset at a tablet width. Before the
first capture at each mobile or tablet width, **prove the emulation took**:

```js
() => ({
  coarse: matchMedia('(pointer: coarse)').matches,
  noHover: matchMedia('(hover: none)').matches,
  touch: 'ontouchstart' in window,
  width: innerWidth, dpr: devicePixelRatio,
})
```

All three booleans must be `true` and `width` must equal the intended width. Run the
check **on the app's page**, not on a blank tab: a page without a `<meta viewport>`
legitimately reports 980 under mobile emulation, which is correct device behaviour,
not a failed emulation. If the check fails on the app, re-run `emulate`; if it still
fails, the target is `blocked`, not captured.
**All of these widths are always in scope; do not ask the user to confirm them each
run.** Figma usually draws only one desktop and one mobile frame, so only those two
widths get a design comparison. **Every other width — the quick-pass widths, tablet,
any width the file does not draw — is tested in senior exploratory mode (Step 3),
with `Figma node: —`.** That is not a mode switch; those screens simply have no frame,
and the frame that exists for a neighbouring width is a hint about intent, never a
reference to file against. The quick pass looks only for the obvious: broken layout,
overlap, horizontal scroll, images scaling wrong, a critical action that stops working.

- **Never trust "loaded".** Scroll down and back up, then confirm no image is
  `!complete || naturalWidth === 0` and no video has `readyState < 2`. Media that stays
  missing while taking up space is a defect; a gap you caused by capturing early is not.
  After opening a dialog wait ~600ms or you capture the fade-in.
- **Capture screen by screen, never one tall image.** Chrome repeats the page from the
  top past 16384 screen pixels (height × dpr), and any image is shrunk to 2000px on its
  longest side before you see it. A page-tall shot is for composition only, and only
  when `scrollHeight * devicePixelRatio < 16384`. `reference.md` has the measurements.
- Real content is longer or shorter than the frame; judge composition, not height.

## Step 8 — `defects.md`: one file, one entry per defect

**One defect is one entry in the whole run — never one per screen, width, device or
environment where it reproduces.** Where it reproduces is a *property* of the entry
(the *Where* and *Screens* lines), not a reason for another entry. Before writing an
entry, search `defects.md` for the same finding; if it exists, extend its *Screens* /
*Where* lines and fold in the nuance ("on Settings the overlap also hides the save
button"). Split only when the screen or device changes the defect itself: different
behaviour, different cause, or a severity gap that changes the priority. "Same as on
the other page" is never grounds for a second entry.

The file has a fixed shape so it reads fast. **Fixed defects go in one table.
Escalated defects go in one numbered list, each with its full fields. The two are
never mixed.** The template below is in English; the real file is in the
conversation's language, with the same field labels translated.

```markdown
# <scope> — <date>

<Two or three lines: mode and who chose it, environment, what was covered, where the
findings clustered.>

## Fixed

| # | Defect | Screens · widths | Why it counted | Fixed by | Change | Proof |
|---|---|---|---|---|---|---|
| F1 | Plan card border was the wrong grey | Billing · 1440 | frame settles it; token-level | agent | `CurrentPlanCard.tsx:41` `border-input` → `border-border` | [before](browser/billing@1440--default.png) · [after](browser/billing@1440--default--after.png) |
| F2 | "Save changes" did nothing | Settings, Profile dialog · 1440, 375 | core action could not complete; the dialog's own copy and the docs say it saves | agent | `ChangePasswordDialog.tsx` missing await + toast | [after](browser/settings@1440--default--after.png) |
| F3 | Invoice total stayed old after a payment | Billing · 1440, 375 | the docs say the total updates on payment; the cache was never invalidated | escalation, approved — fix spread to the query store | `useInvoices.ts` invalidate on `payment.succeeded` | [after](browser/billing@1440--paid--after.png) |

## Escalated

### 1. Invoice list has no empty state

**Medium** · Desktop 1280–2560, Mobile 360–430 · Billing

**What happens**
A new account sees a blank white area where the invoices would be.

**Expected**
A short message saying there are no invoices yet.

**Why it counts**
A blank area reads as a loading failure.

**Evidence**
No frame — the file does not draw this state · [built](browser/billing@1440--empty.png)

**Proposed fix** — not applied, recommended
- What: render the kit's empty-state card when the list is empty
- Where: `InvoiceList.tsx`, ~8 lines
- For users: a new account sees "No invoices yet" instead of a blank area; nothing else changes
- Risk: low
- Why not applied: adds a component

**Decision:** open

---

### 2. The "Save changes" button does nothing
…
```

- **Fixed table**, one row per fixed defect, whether the agent fixed it on its own
  (*Fixed by: agent*) or the user approved an escalation (*Fixed by: escalation,
  approved*). An approved escalation moves from the list into the table; its number in
  the list is retired, not reused. *Proof* links the re-capture.
- **Escalated list**, numbered 1, 2, 3 … continuously, each entry with every field
  below. Group under a screen or shared-component heading only when the list is long
  enough to need it (more than ~8 entries); otherwise a flat list. A defect goes where
  it was first found; its *Screens* line says where else.
- **Nothing else in the file.** Findings judged *not a defect* stay in the ledger's
  Notes; they do not clutter the result.
- **Entry layout, for scanning, not reading:** the title, then **one metadata line**
  — `**Priority** · Where · Screens` — then short sections each with a bold label on
  its own line and a blank line between them: *What happens*, *Steps to reproduce*
  (only when the description alone is not enough), *Expected*, *Why it counts*,
  *Evidence* (frame id and screenshot links on one line, or "No frame — <why>"),
  *Proposed fix* as a five-bullet list (What · Where, with file and rough size · For
  users, what they would notice after the change · Risk · Why not applied), with the
  agent's recommendation in its heading (*recommended* / *not recommended — <why>*),
  *Decision*. A `---` rule separates entries. Never a wall of
  bold-label lines with no spacing.
- *Where* names the device and the width ranges actually verified, widest first
  ("Desktop 1280–2560, Tablet 768–1024, Mobile 360–430") — never "all devices". *Screens* names every screen or state the defect was seen on, or "all
  screens with <component>". *Decision* is `open`, `approved` (then it moves to the
  table) or `declined — <reason>`. *Related:* #n when two entries are genuinely linked.
- Priority by user impact: **Critical** (a key goal is impossible) · **High** (badly
  broken, workaround exists) · **Medium** (clearly noticed, does not block) · **Low**
  (obvious but cosmetic).

## Step 9 — Closing the iteration in the chat

No separate report file. When the iteration ends, post in the chat, in the
conversation's language:

1. two or three sentences — **the mode that was applied and that the user chose it**,
   environment, what was covered, where the findings clustered. If the mode changed
   during the run, say where and why;
2. the **Fixed** table from `defects.md`, verbatim;
3. the **Escalated** list as one line per entry — number, title, priority, decision —
   with the full entries left in the file;
4. the files you touched, if any fix was applied;
5. the path to `defects.md`.

Then offer to turn confirmed defects into tracked work: name the tracker the project
already uses (found in the repo or the session — issues, a board, a task list) and
say what filing does for them ("each open defect becomes an item your team can pick
up, with the screenshots attached"). **Offer, never file unasked**; one confirmation,
not a choice of trackers.

## Step 10 — Clean up the browser (required, every iteration)

The Chrome DevTools MCP launches **its own Chrome window** with a dedicated profile,
`~/.cache/chrome-devtools-mcp/chrome-profile`. Its `close_page` tool refuses to close
the last tab, so the window survives every run and piles up on the user's desktop
unless you close it. **The iteration is not finished until that window is gone.**

After posting the Step 9 summary in the chat:

1. `list_pages`, then `close_page` for every page the run opened. The last page cannot
   be closed by the tool; leave it.
2. Quit the MCP's Chrome — and only it — by its profile directory:

   ```bash
   pkill -f "user-data-dir=$HOME/.cache/chrome-devtools-mcp/chrome-profile"
   ```

   This matches nothing but the MCP-launched browser; the user's own Chrome, which
   runs on its default profile, is untouched. The MCP relaunches a fresh window on the
   next tool call, so nothing is lost.
3. Confirm: `pgrep -f chrome-devtools-mcp/chrome-profile` prints nothing.
4. Say in the chat that the browser window was closed. If the kill was refused or the
   process survived, say so and give the user the command to run themselves.

Do not skip this because the run was short or found nothing; do not leave it to the
user.

## Red flags

| If you catch yourself… | Do instead |
|---|---|
| Starting anything before the user has chosen the mode | Step 1: describe both modes in product terms, wait, record the answer |
| Running a target through one lens and moving on | Four lenses, one at a time, then the step-back pass; the ledger Notes say which ran |
| Opening a target without knowing what it is for | Step 2.5: read the docs or the code first; the *Expected* line has to come from somewhere |
| Probing Figma to decide the mode yourself, inferring "no design" from a repo with no Figma trace, or putting "Figma or exploratory?" as a bare two-word choice | Describe both modes and what each gives; a sign of a design in the repo is a hint in that message, never a default |
| Figma did not answer, and you moved on in exploratory mode | Stop. Report what failed and what was tried; recommend the way forward with its consequence. The switch is confirmed by the user, never assumed |
| Debugging "the Figma tools are missing right after install" as a broken plugin | It is the session: `/reload-plugins`, then `/exit` + `claude --continue`; check again |
| A summary or report that does not say which mode was applied | Add it; the reader must know what the findings are based on |
| Writing `defects.md` or a chat message in a language other than the conversation's | Rewrite before saving or posting |
| Opening a page with anything but the Chrome DevTools MCP — Playwright, Vitest browser, curl, a script, a pasted screenshot | Stop. Get the DevTools MCP answering first; there is no fallback browser |
| Proposing a "lighter" run because the DevTools MCP is down | Stop and report the blocker; the iteration waits |
| Capturing a mobile or tablet width without `mobile,touch`, or without proving it took | Re-emulate and run the check; a narrow desktop window is not a device |
| Filing "does not match the design" with no frame | Senior exploratory mode: judge, and say why |
| Filing a 1280 or tablet finding against the 1440 or 375 frame | That width has no frame; judge it by good sense |
| Capturing a target in one theme only, or filing the other theme against the canonical frame | Both themes, every target; the second theme is Lens 1's second pass, judged by the token sources and good sense |
| Fixing a wrong dark-theme value inside the one component where you saw it | Trace it: a component slip is yours; a wrong token is one escalated entry for every screen that uses it |
| Asking the user which widths to test | All of them, always; only the frame widths get a design comparison |
| A finding with no *Why it counts* | Add the reason or drop the finding |
| An escalation that is only a question | Add the proposed fix: what, where, size, what users would notice, risk — and your recommendation |
| Asking the user an engineering question — which environment, which tracker, which design source, whether to add a tool | Decide, say what it means for the product, get it confirmed |
| Escalating a defect only because its cause is in state, a hook, a route or server code | The layer is not the test; if the intended behaviour is already settled, trace the cause and fix it through the protocol |
| Self-fixing something nothing has settled — a rule, a default, a threshold, copy, who sees what | Escalate with a proposition; that is a product decision |
| Patching the symptom in the view when the cause is one layer down | Research to the cause; a symptom patch leaves the defect and adds a second |
| Self-fixing on production, or a style value with no design-system source | Escalate |
| Leaving a fix the re-capture did not confirm | Revert your own edit, escalate |
| Filing a missing widget the user said is out of scope | Drop it; it is in the scope block of `targets.md` |
| Judging from `get_design_context` JSX or a 1024px thumbnail | Screenshot the node at natural width and look |
| Assuming a URL, port or login | Read it from the repo or the running server; ask if blocked |
| Capturing on load, a dialog right after opening, or the whole page at once | Scroll and verify media; wait ~600ms; screen by screen |
| Committing anything, or the artefacts folder | Never; the user decides |
| A third attempt at a target, or a long silent loop | Escalate after two; report per screen |
| One defect repeated per width, per screen, per device, or "same as on the other page" | One entry for the whole run; screens in *Screens*, widths in *Where* |
| Writing an entry without searching `defects.md` for it first | Search, then extend the existing entry or write a new one |
| Creating a plan, log, report or per-page defect file | Three files only: `targets.md`, `defects.md`, the screenshots |
| Ending an iteration without the Fixed table and the Escalated list in the chat | Step 9 is not optional |
| Ending an iteration with the MCP's Chrome window still open | Step 10: close the pages, quit that Chrome by its profile dir, confirm |
| Mixing fixed and escalated defects in one list or table | Fixed → the table; escalated → the numbered list |
| Moving to the next target right after a finding | Stay in the cluster: siblings, states, widths first |
| Spreading the budget evenly over every target | Weight it toward the newest, most complex, and already-suspect sections |
| "The API returns 500" in the user-facing text | What the user sees; causes go in Proposed fix |
