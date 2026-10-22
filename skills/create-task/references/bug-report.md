# Bug report format

Use this structure for every task of type `bug`. Everything in `SKILL.md` still applies:
the investigation in Step 2, product language, terseness, the `[BUG]` title prefix, the
link rules and the formatting for `description_md`. This file defines only the body of a
defect and how it differs from a feature.

A defect is written from what actually happens, not from what the person said happens.
Step 2 established the exact conditions; the report states them.

## One bug or several?

Before drafting, decide:

- **One defect** → the single-bug format below.
- **Several small defects that share a context** — a batch of glitches on one screen, a
  set of problems one person would fix in one sitting — → one grouped task, in the
  grouped format at the end of this file. **Propose this to the person and let them
  confirm**; never switch to the grouped format silently. Recognise the case from an
  explicit request ("one task for all of these") or from the material (several distinct
  small problems, clearly bonded).

If one of the small defects turns out to need its own reproduction steps or is not small,
it is its own single-bug task.

## Single bug

Required sections, in this order.

### Problem

What actually happens — the broken behaviour, plainly, in one to three sentences, with
the situation it happens in. No causes, no fixes, no speculation.

### Steps to reproduce

Numbered, terse, action-oriented, from a state the reader can reach: which screen, which
account kind if it matters, what to do, what to observe. A screenshot or recording of the
actual result is linked on the verb of observation (`[Observe](url) that…`).

### Expected

What should happen instead. **Always present**, even when it seems obvious. If a design
or a sibling screen shows the expected result, link it on its name (`the [design](url)`).

### Where it shows (optional)

Only when the investigation found the same defect in more than one place, or found that
it depends on a condition the steps do not make obvious (a plan, a role, a theme, a
viewport). Product words: "also on the admin task view", "only for workspace members who
are not admins", "only in the dark theme". Not file paths.

A pointer to code is **not** part of the task. The investigation's notes stay with you;
if the person who takes the task is the agent, it will find the code again from the
steps — a task is read by people first.

### Body template

```markdown
## Problem
(the actual, broken behaviour and the situation)

## Steps to reproduce
1. ...
2. ...
3. [Observe](url) that ...

## Expected
(what should happen instead — required)

## Where it shows
- (omit the whole section when the steps say it all)
```

## Screenshots and recordings

- A screenshot or recording of the actual result is linked on the verb of observation in
  *Steps to reproduce* or *Problem* (`Observe`, `see`, `notice`, `the [recording](url)
  shows`).
- A screenshot of the expected result is linked in *Expected* (`the [expected layout](url)`).
- A recording (Loom, YouTube, a direct video URL) is a link like any other, never embedded.
- **Several screenshots or recordings and it is not clear which shows what** (actual or
  expected, which step, which defect in a grouped task): ask before writing. A picture
  under the wrong heading makes the report mislead; this one question is part of
  writing the defect.

## Grouped bugs

Several small, bonded defects in one task, only after the person confirmed grouping.
Each defect is a numbered item with its own actual and expected result; no per-item
steps and no per-item "where it shows".

```markdown
(optional: one line naming the shared context — the screen, the flow)

1. **Short name of the defect**
   - **In fact:** the actual, broken result — plain text, a [screenshot](url) or a [recording](url)
   - **Expected:** what should happen — plain text, a [screenshot](url) or a [recording](url)

2. **Short name of the defect**
   - **In fact:** ...
   - **Expected:** ...
```

The title still takes `[BUG]`; the priority is proposed as usual, for the group as a
whole.
