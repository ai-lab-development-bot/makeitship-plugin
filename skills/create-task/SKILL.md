---
name: create-task
description: >
  Create a well-formed task on the Makeitship board from this conversation — a feature, an
  enhancement, a bug report or a docs change. Use when the person says "create a task",
  "track this", "put this on the board", "file a bug", "report a bug", "log this", says
  something is broken or not working, or describes work they want tracked. Not a transcript
  of what they said: the skill decides the task's type, investigates first — in the code
  when it is there, otherwise in the running product through a browser — finds what the
  request actually entails, settles the open decisions with the person as propositions in
  product language, and writes the task in the format its type needs (a defect is reported
  differently from a feature). Creates the task through the makeitship MCP server and
  reports back. Who does the task — the person, the agent or the Makeitship team — is a
  separate question this skill does not decide.
---

# Create a task

Without the makeitship MCP server connected this skill does nothing: say so and point the
person at the Connect agent page of their Makeitship dashboard.

A task is a unit of work the workspace tracks on its board, whoever ends up doing it. A
good task is one a stranger can pick up a week later and do without coming back to ask
what was meant. Writing down what the person said is not that; this skill makes the
task from what the person wants, what the product does today, and what the request
turns out to entail.

## Who you are working for

The person is most likely the product owner, not an engineer. They know what they want
the product to do; they do not know the codebase, and they may not have it at hand at
all — often they are looking at the live product and telling you what they see.

- **The investigation is yours.** How the product behaves today, where the request lands,
  what it touches, what it would break: you find that — in the code when you have it, in
  the running product when you do not — and you do not ask them to.
- **The decisions about the product are theirs**, and they reach them as propositions:
  what the product would do, who it affects, your recommendation, the alternative in one
  sentence. Never as an engineering question ("should the cascade be soft or hard?") and
  never as a bare question with no proposed answer.
- **The task text is product language.** It says what a user sees, can do, or receives.
  File paths, component names, endpoints, table names, status codes and library names do
  not appear in it; every fact learned from code is translated into what a user would
  observe.
- **Facts only they hold are asked once, in product words, with the reason**: the address
  of the product and a login when you need to look at it; which screen they were on;
  whether a design exists. One message, not a drip.

## Step 1 — Decide the type

The type decides how the task is written. Decide it yourself from what the person said and
what you find; ask only when the signals genuinely conflict.

| The request | Type | Title prefix |
|---|---|---|
| Something behaves differently from what it should — an error, a wrong result, a control that does nothing, a regression | `bug` | `[BUG]` |
| Functionality that does not exist yet, even a small piece bolted onto something existing | `feature` | `[FEATURE]` |
| A change to the logic or behaviour of something already implemented | `enhancement` | `[ENHANCEMENT]` |
| Documentation only | `docs` | `[DOCS]` |

The deciding test between `feature` and `enhancement`: does the thing already exist in the
product? If not, it is a feature. "Broken" versus "works as designed but the person wants
it otherwise" decides `bug` versus `enhancement`: a report of a mismatch is a bug only if
the product's own intent (its docs, its sibling screens, its stated behaviour) says it
should behave differently. When the investigation shows the "bug" is the product doing
what it was built to do, say so and make it an enhancement — the person decides whether
they still want it.

A bug request may cover several small, related defects: `references/bug-report.md` says
when to group them in one task and how.

## Step 2 — Investigate before writing

Never write the task from the chat alone. Establish **today** — how the product behaves
now — and **what the request entails**, from the best source you can reach. Three
sources, in this order of preference; use more than one when both are at hand (the
product shows what users see, the code shows why).

### 2a. The code, when you are in the project (read-only)

1. **Locate the area**: the screen, flow, component, server function, migration or doc the
   request touches. Read the project's docs and agent instructions for what the area is,
   then the code for what it actually does.
2. **Establish today** as the code proves it — not as the docs or the person describe it.
   Docs are hypotheses; where a doc and the code disagree, the code is today, and the
   disagreement is worth a sentence to the person.
3. **For a bug**: follow the reported behaviour through the code until you can say what
   actually happens and in which situation. Confirm it is a deviation (Step 1), find the
   exact conditions, and find whether the same defect shows elsewhere. Do not fix it.
4. **For a feature or enhancement**: run the request through the checklist below against
   the code. Most items the code answers; those become facts of the task. The ones it
   cannot answer become decisions for Step 3.

If the code does not yield the area — you cannot locate it, or what you find contradicts
the report — switch to 2b if the product is reachable, otherwise say so and ask one
precise question. Do not guess a location and do not invent behaviour.

### 2b. The running product, through a browser (no codebase, or to see what users see)

This is the common case for a product owner: they are looking at the product, something
is wrong or missing, and there is no repository in the session. You go and look.

The browser mechanics are those of the `web-ui-exploratory-qa` skill in this plugin —
**its "The browser: Chrome DevTools MCP, and nothing else" section for opening the
product, its Step 7 for capturing a screen or a state properly (scroll, wait for media,
one screen at a time), and its Step 10 for closing the browser when you are done.** Read
those sections and follow them; do not re-derive them here. What you do **not** take
from that skill: its lenses, its loop over every screen, its artefact folder and
`defects.md`, its fix protocol. You are not auditing the product; you are establishing
the facts one task needs, and you change nothing.

1. **Ask once for what only they hold**, in product words, with the reason: the address
   of the product and a login if the screen is behind one ("so I can open the screen you
   mean and see it myself"), and — when it is not obvious from what they said — which
   screen and what they did just before. One message.
2. **For a bug**: reproduce it from their words. Walk to the screen, do what they did,
   watch what happens; vary the one or two conditions that could matter (another width,
   the other theme, a second attempt, a different item) so the steps you write are the
   exact ones. If it does not reproduce, say what you did and what you saw, and ask what
   differs — do not file steps you could not confirm.
3. **For a feature or enhancement**: walk the screens the request touches and the ones
   next to them, to say what the product does today and where the new thing would live.
   Run the checklist below against what you see; what the product shows is a fact of the
   task, what it cannot show (rules, limits, what happens to data) is a decision for
   Step 3.
4. **Close the browser** as that skill's Step 10 prescribes. The task is the output; no
   folder, no report.

Screenshots you take this way are local files and cannot go into the task (the task view
takes only public URLs). Describe what you saw in words. When a picture would help the
task — a bug that is easier seen than read — offer the person the two ways, the first
preferred because it needs nothing from them after the fact:

1. **A link to a screenshot or recording** (any public URL: a screenshot host, Loom, a
   shared drive). You put it into the task text as a link on the word that says what it
   shows (`[Observe](url) that …`), so whoever reads the task clicks straight to it.
2. **Attaching it to the task afterwards**: once the task exists, you give them its
   number and they add the file from the task view themselves.

Ask in one line, with the preference stated; do not wait for a picture to write the
task.

### 2c. The person's words only

When there is no code and the product is out of reach (no address, no login, a flow you
cannot drive from a browser), the task is written from what the person says. Then *Today*
is marked as reported, not verified ("As reported, …"), the Step 3 message carries more
decisions than usual, and the task says in one line that it was written without seeing
the product. Never present an unverified claim as a fact.

### What the request entails — every source

The person asks for one thing; the product may need more for that thing to make sense.
Look for: what else must change for the request to work, what it would leave
inconsistent, what existing data or users it affects, what it silently breaks. Keep
notes; nothing of this goes into the task as paths or code.

### The checklist (features and enhancements)

Skip an item only when it clearly does not apply.

- **Who**: which roles can do this, which cannot; what a user without permission sees.
- **Where**: from which screens, flows, links, notifications the user reaches it; mobile
  and desktop.
- **Confirmation and feedback**: is a confirmation needed; what success looks like; what
  failure looks like and whether the user learns why.
- **Related data**: what else is affected — child items, counters, attachments,
  notifications, search, external records; removed, kept, hidden; reversible or not.
- **Boundaries and repeats**: nothing to act on; very many; the same action twice or from
  two devices; connection lost mid-action; the item changed by someone else meanwhile.
- **Other users and realtime**: who sees the change and when; notifications.
- **Copy and design**: is there a design for every state (default, confirmation, success,
  error, empty, loading); who owns the words.
- **Existing data and rollout**: what happens to records created before this change;
  everyone at once or staged.
- **Plan and quota**: does the change interact with plan limits, billing, or what a free
  workspace may do.

## Step 3 — Settle the decisions with the person, as propositions

What the investigation answered is a fact of the task. What it could not answer is a
decision, and decisions reach the person in **one message**, ordered by impact: what
changes the size of the task first, then behaviour, then polish. Merge decisions that
hang on the same choice.

Every decision is written like this, in the conversation's language:

```
<The decision as one product sentence>
What it affects: <who, and what they would notice>
Proposed: <your recommended answer>. Recommended — <why, one clause>.
Alternative: <the other option and what it would mean>.
```

Two things belong in this message besides decisions:

- **What the request entails.** When Step 2 showed the request is bigger than its wording
  — the feature needs a second piece to make sense, the fix must land in three places, the
  change leaves something inconsistent unless it is handled too — say so plainly and
  **propose the scope**: include it in this task, or split it into a second task you
  create next. The person decides; you never silently narrow the task to its wording, and
  you never silently widen it either.
- **Noticed, not in this task.** A defect or gap that exists whether or not this request
  happens (an old bug nearby, a stale doc) is one line, with the offer to create a
  separate task. It goes into this task only if the person says so.

The person answers in whatever form: accept the proposal, pick the alternative, give their
own answer, or say the answer depends on someone else. Nothing is filled in by guessing.
When the message needs no decisions at all, skip it: proceed to the draft.

**Priority** is yours to propose, not theirs to pick from a list: `high` only when they
are blocked or users are losing money, data or access; `low` for polish; `medium` otherwise.
State it in the draft; they overrule if they disagree.

## Step 4 — Write the task

**Language**: the task's title and text are in English, whatever the conversation's
language; a task is a persisted artefact others will read. The conversation stays in the
person's language.

**Title**: the type prefix, then a short imperative sentence a stranger understands. Under
80 characters including the prefix. `[BUG] Comment stays visible after its author deletes
it`, `[FEATURE] Archive a task from its menu`, not `[BUG] Fix comments`.

**Terse**: essential information only; no speculation chains, no "could be X or Y", no
defensive caveats, no restating the obvious, no suggested follow-up work (that is a
separate task), no list of what you read or which screens you opened.

### Feature, enhancement, docs

```markdown
## Context
Who the user is and what they are trying to do. One or two sentences.

## Today
How the product behaves now, as verified — in plain language. If the feature partly
exists, say so; the task is about the gap. "As reported, …" when written from the
person's words only (2c).

## Change
What is different after this task, and why. The decisions taken in Step 3 are written
here as facts, not as questions.

## Done when
- [ ] One observable behaviour per line, from the user's point of view, checkable by
      using the product.
- [ ] Every "must" has its "must not" and its boundaries next to it: the wrong user,
      the cancelled action, the failed action, nothing to act on, the same action twice.

## Out of scope
- What this task explicitly does not cover — including what the person declined to
  include in Step 3.

## Open questions
1. Only for a decision the person said depends on someone else. The question, why it
   matters, the proposed answer, the alternative. A "Done when" line that hangs on it
   ends with "(pending Open question 1)".
```

Omit *Out of scope* and *Open questions* when they would be empty. An *Open questions*
section exists only for decisions the person explicitly deferred to someone else; a
decision they could take now is taken now, in Step 3, and never parked here.

### Bug

Follow `references/bug-report.md` exactly: the single-bug format (problem, steps,
expected result) or the grouped format for several small related defects.

### Formatting

`description_md` is Markdown; the task view renders it as blocks the person can read and
edit. Write it so it reads well:

- Headings start at `##` — the title is the H1.
- Several observable parts of done → a to-do list, one `- [ ]` per part.
- Facts that differ per environment → a GFM table (`| Env | Host | Owner |`).
- One `> [!TIP]` callout at most, for the one thing the person must not get wrong.
- Commands and error text in fenced code blocks (the only place code-looking text
  belongs, and only when the person will have to type or match it).
- Links as `[text](url)`, on the word that says what the link shows: `[Observe](url)
  that the dialog…`, `the [design](url)`. A recording is a link too, never embedded.
  A screenshot or diagram is `![what it shows](public url)` only when the person asks
  for it inline — a URL anyone can open; never a path on a machine, never a file.
- Plain Markdown only: no raw HTML, no `<details>`, no emoji callouts, no `#` heading.
- The limit is 20 000 characters; shorter is better.

Example (enhancement):

```markdown
## Context
A team member wants to remove a comment they wrote by mistake on a task.

## Today
A comment, once posted, stays on the task for good. Only a workspace admin can remove
a task, and that removes every comment with it; nothing removes one comment.

## Change
The author of a comment can delete it from the comment's menu, with a confirmation.
A workspace admin can delete any comment the same way. Attachments on a deleted
comment are removed with it.

> [!TIP]
> Deleted comments do not leave a placeholder; the comment simply disappears for
> everyone.

## Done when
- [ ] The author sees "Delete" in their own comment's menu; confirming removes the
      comment and its attachments for everyone, without a page reload
- [ ] Cancelling the confirmation changes nothing
- [ ] A member who is not the author sees no "Delete" on that comment
- [ ] A workspace admin sees "Delete" on every comment
- [ ] If the deletion fails, the comment stays and the user sees an error

## Out of scope
- Editing a posted comment
```

## Step 5 — Create it

Call `create_task` (`mcp__plugin_makeitship_makeitship__create_task`) with:

- `title`, `description_md`, `priority` (`low` | `medium` | `high`), and `status` only when
  the person named a column — then call `list_task_statuses`
  (`mcp__plugin_makeitship_makeitship__list_task_statuses`) and pass that column's `slug`;
  otherwise the task lands on the workspace's default status.
- `idempotency_key` — one unique string (a random id, or the triggering message's id)
  generated when you first decide to create this task, reused on every retry of the same
  call, so a retry never creates the task twice and two requests never collapse into one.

When the person agreed to a second task in Step 3 (a split-off scope, a defect noticed
nearby), create it next with its own key, after the first is confirmed.

## Report back

Tell the person the task was created as `#12 Title` — the task's number (the `number` in
the answer, shown as `#12` on the board) and its title — the column it landed in, and the
priority. If they chose to attach a screenshot or file themselves (2b), name the task
again as the place to add it. The number and the title are how people know a task; never name it by any other
identifier. If a second task was created, the same line for it. Replies appear as comments
they can read with `track-tasks`. Do not poll; the person asks when they want an update.

## When the call is refused

- "not in your plan" or a quota message — repeat the tool's message verbatim; the person
  decides. Do not retry.
- "unknown status" — the workspace changed its columns: call `list_task_statuses` again
  and ask which column the person means.
- an authentication error — the connection needs a fresh approval: `/mcp` in Claude Code,
  `codex mcp login makeitship` in Codex.

## Red flags in your own draft

| Thought or draft | Reality |
|---|---|
| "They said it quickly; I'll write what they said" | Investigate: the code, or the product in a browser. A task written from the chat alone is the one that comes back with questions. |
| "No repository here, so there is nothing to investigate" | Open the product (2b). The person's own words are the last resort (2c), and the task then says so. |
| A bug filed with steps you could not reproduce | Say what you did and saw; ask what differs. |
| Running the full exploratory loop, a folder, a `defects.md` for one task | Only the browser mechanics are borrowed; the task is the output. |
| A file path, component, endpoint, table, status code or library name in the task text | Translate it into what a user observes, or drop it. |
| A question to the person with no proposed answer | Not finished. Add the proposal and the alternative. |
| An engineering question to the person | Decide it yourself; show them only what changes the product. |
| "The request is bigger than they think, but I'll do what they asked" | Say it and propose the scope. Silence narrows the task without their knowing. |
| "I found a bug nearby; it belongs here" | One line in the chat, a separate task on a yes. |
| A "must" in *Done when* with no "must not" or boundary next to it | Add the negatives, or say in the chat why there are none. |
| A decision the person could take now, parked in *Open questions* | Ask it in Step 3. *Open questions* is for what depends on someone else. |
| A "bug" the product does on purpose, filed as a bug | Say so; it is an enhancement if they still want it. |
| Changing code, or anything in the product, while creating the task | Never. The task is the output. |
| Leaving the browser window open after looking | Close it as `web-ui-exploratory-qa` Step 10 says. |
| Asking the person to pick a priority | Propose one; they overrule. |
