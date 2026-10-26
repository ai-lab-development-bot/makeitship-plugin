---
name: consult-project-docs
description: >
  Load the project's implementation docs that matter for the task at hand, before acting on
  existing functionality. Use BEFORE planning, investigating, debugging, reviewing or
  changing code that already exists — "plan X", "investigate Y", "why does Z", "fix this
  bug", "add a feature to", "how does X work", "explain this module", onboarding onto a
  codebase — and whenever you are about to modify a module you have not read in this session.
  Reads `docs/INDEX.md` (kept by `document-implementation`) and pulls in only the docs whose
  description or triggers match the task, so the agent does not plan or fix in the dark and
  does not reread every doc. When the project has docs but no index, hands over to
  `document-implementation` to propose one. Not for writing docs.
---

# Consult the project docs

The front door for any task that touches existing functionality. Without it an agent plans
and investigates without the docs that hold the context it needs — and either guesses or
rereads everything. The index (`docs/INDEX.md`) is one table, a name and a sentence per doc;
reading it costs little, and it tells you which few docs to open.

## Who you are working for

The person is most likely the product owner, not an engineer. This skill is invisible to
them: you choose what to read and you read it. Nothing here is a question for them, and
nothing is reported to them — which docs you loaded matters only to your own work.

## When to use it

- A question about how or why existing functionality works.
- Planning, investigating, debugging, reviewing or changing something that exists. For "add
  feature B to module X", the docs to load are X's.
- Onboarding onto a codebase or a module.
- About to modify a module you have not read in this session.

Skip it for trivial edits in code you have just read, for greenfield work that touches
nothing existing, and when this conversation already loaded the context.

## 1. Find the index

`docs/INDEX.md` at the project root; in a monorepo also one level deeper
(`packages/*/docs/INDEX.md`, `apps/*/docs/INDEX.md`) — prefer the index closest to the files
the task is about.

| State | Action |
|---|---|
| An index is found | Step 2. |
| No index, but the project has docs (`docs/`, `doc/`, `documentation/` with `.md` files beyond plans) | Hand over to `document-implementation`, Step 0: it proposes the indexed approach to the person, once per session. Until there is an index, read the docs that obviously match by name and continue. |
| No index, no docs | Nothing to consult; continue with normal exploration. |

## 2. Pick the docs

Read the index in full. For each entry, judge from its `description` (and `triggers`)
whether it bears on the task. Be selective — loading everything defeats the purpose.

- Match on the module, area or noun the task names.
- Follow `related` from each loaded doc, one level deep, never transitively.
- Usually three to five docs. When the task genuinely spans more, take the ones closest to
  the first step of the work and come back for the rest when you reach it.

Read the chosen docs in full.

## 3. Treat them as context, not authority

Docs are usually agent-written and can be stale. A claim a doc makes about behaviour is a
hypothesis you confirm in the code before you rely on it. Where a doc and the code disagree,
the code is what runs; the disagreement is worth fixing — with `document-implementation`
when you are changing that area anyway, otherwise worth one line in your report.

## 4. Notice an index out of date

After loading, compare the `.md` files under the docs root (without `INDEX.md` and the plan
folders) with the index. Files missing from it, or without frontmatter, are
`document-implementation`'s to add — do it when you document your own change, or in the
same session if the gap is small. It never blocks the current task.

## Plans are not docs

Never load plans or specifications of unbuilt work as reference: `docs/plans/`, `plans/`,
`specs/`, a planning skill's own folder, `*-plan.md`, `*-spec.md`. They describe what was
intended, not what exists, and would mislead you about the code. Reading a plan because the
task is about that plan is ordinary file reading, not this skill.

## What this skill does not do

It does not write or change documentation — that is `document-implementation`. It does not
run git, search the web or call any MCP server.
