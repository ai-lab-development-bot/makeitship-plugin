---
name: document-implementation
description: >
  Write and maintain implementation documentation — living reference docs that say how a
  feature or module works right now, why it was built that way, and what to know before
  changing it — each with frontmatter, listed in `docs/INDEX.md` so an agent finds the right
  doc before its next task without rereading everything. Use whenever an implementation is
  finished or significantly changed (a feature, a fix that changes behaviour, a refactor, a
  new integration) — as part of finishing the work, without being asked — and when asked to
  "document this", "write up how this works", "update the docs", "set up the docs index",
  "migrate the docs". In a project whose docs have no index yet, it first proposes the
  indexed approach once, explaining what it changes and why, and migrates only on a yes. Not
  for changelogs, session logs, decision records or implementation plans; for finding the
  docs relevant to a task, see `consult-project-docs`.
---

# Document the implementation

Each document answers the questions a developer — human or AI — asks before touching the
code: what does this do, why was it done this way, what are the gotchas. It is not a
changelog or a session log. It does not track *when* things happened or *who* did them; it
describes *how things work right now* and *why*.

The docs form a loop with `consult-project-docs`: this skill writes a doc and lists it in
`docs/INDEX.md`; before the next task, that skill reads the index and loads only the docs
the task needs.

## Who you are working for

The person is most likely the product owner, not an engineer. They want the product to keep
moving; they do not want to decide what a doc is called, where it lives, or what goes in it.

- **The documentation is yours.** Whether a change needs a doc, which doc, its structure,
  its description, where it lives: you decide, and you do not ask. When docs do not exist
  yet, they go in `docs/`.
- **Writing it is part of finishing the work.** When an implementation is done, document it
  before you report the work as finished; do not offer to, and do not ask whether to.
- **The one decision that is theirs** is switching an existing documentation system to the
  indexed one (Step 0), because it changes how their project's docs are kept. It reaches
  them once, in product words, with your recommendation.
- **The docs themselves are engineering text.** Unlike a task, they name files, functions,
  components and tables exactly — that is what makes them useful to the next agent. They are
  written in English, whatever the conversation's language.
- **The report is one or two lines** in the conversation's language: which docs were written
  or updated. No summary of their content, no offer to adjust.

## Step 0 — Find the documentation and how it is kept

Before writing anything, look at what the project already has. The goal is consistency: a
new doc must look like it belongs.

1. **Find the docs.** `docs/`, `doc/`, `documentation/`, docs at the project root, links
   from `README.md`; in a monorepo also one level deeper (`packages/*/docs/`, `apps/*/docs/`).
2. **Recognise the pattern, and who dictates it.** Open two or three docs and note the file
   naming, the structure, the frontmatter, the level of detail, how they cross-reference.
   Then look for a tool or a rule that imposes the pattern:
   - a documentation site (Docusaurus, MkDocs, VitePress, Nextra) with its own navigation
     and frontmatter;
   - architecture decision records (`docs/adr/0001-…`);
   - plans and specifications written by planning skills (`docs/superpowers/`,
     `docs/plans/`, `specs/`);
   - an index already in place (`docs/INDEX.md` with a `Name | Description | File` table);
   - documentation rules in the project's agent instructions;
   - a check in CI that holds the docs to the code (a docs lint, a link checker).
3. **Recognise the plan folders.** Plans and specifications describe work before it is done;
   they are not reference docs and never enter the index. Judge by name and content, not by a
   fixed list: `docs/plans/`, `plans/`, `specs/`, a planning skill's own folder, files named
   `*-plan.md`, `*-spec.md`, `*-proposal.md`, `*-rfc.md`, text dominated by "we will" and open
   questions. Never write into them and never index them.

Then branch:

| What you found | What you do |
|---|---|
| `docs/INDEX.md` exists | Write and update docs in its format (Steps 1–3). |
| Docs exist, no index | Propose the indexed approach once (below), then act on the answer. |
| No docs at all | Start the indexed approach in `docs/` without asking: there is nothing to switch from. |

### Proposing the indexed approach

One message, in the conversation's language and in product words, built from what Step 0
found:

1. **What the documentation is today**, in a sentence: how many docs, how they are kept, and
   what dictates it, if anything.
2. **What the index is and why it is worth it.** A table at `docs/INDEX.md` with each doc's
   name and one sentence about what it holds. Before a task the agent reads that table and
   opens only the few docs the task needs, instead of rereading all of them: fewer tokens,
   so each task costs less time and money, and a better chance that everything relevant to
   the task is found, because the agent searches by descriptions rather than by guessing.
3. **How it flows.** After each implementation the agent updates the doc of what it changed
   and the table; before the next task it reads the table and loads what it needs.
4. **What changes in the files.** A short block with a name and a description goes at the top
   of each doc, and `docs/INDEX.md` appears. The text of the docs does not change. Plans and
   specifications stay as they are and stay out of the index.
5. **Anything a tool or a rule already dictates**, called out on its own: how the index lives
   with it, or why it would conflict ("your docs site reads its own frontmatter; the new
   fields sit next to it and the site ignores fields it does not know").
6. **Your recommendation**, and what happens otherwise: "I recommend switching. If not, I
   keep documenting in your current format, just without the index." When the pattern in
   place would genuinely conflict, the recommendation can be not to switch.

On a **yes**: migrate (below) without further questions — the classification of unclear
files and every description are yours. On a **no**: document in the project's existing
format, without frontmatter or index, and do not propose it again in this session.

### Migrating existing docs

1. Collect every `.md` under the docs root, except `INDEX.md`, the plan folders, a
   navigation-only `README.md`, and docs that already carry frontmatter with `name` and
   `description`.
2. Classify each: an implementation doc (describes how something that exists works), a plan
   (excluded), or unclear — decide unclear ones yourself from their content; when a file is
   neither, leave it out of the index.
3. Prepend the frontmatter (below) with `name` and `description` only. **Change nothing else
   in the file.** Keep any frontmatter a tool already uses, adding the two fields to it.
4. Write `docs/INDEX.md` (Step 3).
5. Report in a line or two: how many docs were indexed, how many left out and why.

A second migration on a fully indexed tree finds nothing and touches nothing.

## Step 1 — Decide what to document

Review what was implemented in this session (the diff, the conversation), then decide the
scope: one doc, several, or a section of an existing one. Update an existing doc rather than
create a near-duplicate.

**Probably needs a doc:** a new module, service or subsystem; a feature with non-obvious
behaviour; trade-offs not visible in the code; infrastructure or configuration that needs
explaining; an integration with an external service.

**Probably does not need its own doc** (a line in a parent doc at most): a simple bug fix, a
CRUD endpoint following established patterns, a minor configuration change, self-explaining
code.

## Step 2 — Write or update it

### Never document the process

The document describes the system as it is, never the work that produced it. Plans live in
their own folders, and git holds the rest. Four things leak in most often, and none belong:

- **Named in-flight initiatives** — "the migration", "the redesign", "this PR", a decision ID
  from a temporary planning document. A reader months from now does not know what they refer
  to, and by then they are over.
- **The document's own history** — "an earlier draft of this section said…".
- **The change that produced the current state** — "X used to be three modules", "since the
  merge", "this was rewritten in". Describe what is, not how it got there.
- **Roadmap** — "the visual pass is separate work", "temporary until Y ships". It dates the
  document and turns false without anyone editing it.

**The hard case: history that reads like a reason.** Sometimes the past *is* the explanation.
The test is **who the sentence is addressed to**.

> There is no limit on how far the list pages. An earlier `MAX_LOADED = 200` silently
> truncated it for the heaviest accounts.

Addressed to the next person tempted to add a cap. Keep it.

> A draft of this change also rendered the banner on the sub-page, and that was wrong.

Addressed to nobody. When history earns its place it prevents a specific future mistake — so
write the prevention, not the anecdote: "Do not render this banner on the sub-page. Nothing
there can clear the pending state, and the row it warns about arrives on its own."

**Never cite a temporary document.** A redesign spec, a migration plan, a scratch folder
scheduled for deletion: a reference to any of them is a broken link with a date on it. State
the fact self-containedly instead.

### Frontmatter

Every doc in an indexed project starts with:

```yaml
---
name: <kebab-case identifier, matching the filename without .md>
description: <one sentence for AI triage: what this doc covers and when an agent needs it>
triggers: [optional keywords or verbs that should pull this doc into context]
related: [optional names of adjacent docs]
---
```

- `name` — required, kebab-case, the filename stem.
- `description` — required, one specific sentence. Not "Auth module docs" but "How JWT auth
  works in this service, including the in-memory token store and the middleware chain that
  validates each request." The index and the router live on it; when a doc's scope changes,
  its description changes with it.
- `triggers` — optional and sparing; let `description` do most of the work.
- `related` — optional, other docs' `name`s.

### Structure

Match the project's existing docs when it has them. Otherwise use
`references/doc_template.md`, whose core sections are: **Overview** (one to three sentences;
enough to decide relevance), **Problem** (when the motivation is not obvious), **Approach**
(how it works — the core), **Trade-offs & Constraints** (what was chosen, what was
sacrificed, what cannot change safely), **Key Files** (paths from the project root, only the
ones someone would modify), **Things to Know** (gotchas, non-obvious behaviour, edge cases),
**Related Docs** (only when they exist). A small utility may need three of them; a subsystem
all of them and more.

### Updating

Rewrite the affected sections to be accurate now; never append "Update: we changed X". When
the trade-offs shifted, update them too. When the feature outgrew the doc's structure,
restructure it — split or merge docs as long as the result is clear and accurate. Remove what
is no longer true: an outdated doc is worse than none.

### Written for agents first

- **Explicit**: no reliance on the conversation; state facts directly.
- **Consistent names**: the exact string the code uses — `AuthMiddleware`, never also "the
  auth layer".
- **Frontloaded**: each section's first sentence tells an agent whether to read on.
- **Exact paths**: relative to the project root.

## Step 3 — Regenerate the index

After every create or update in an indexed project, regenerate `docs/INDEX.md` — the whole
file, no merging:

```markdown
# Project Documentation Index

Maintained by the documentation skills; do not edit by hand — update the docs and regenerate.

| Name | Description | File |
|------|-------------|------|
| auth-module | How JWT auth works in this service, including the in-memory token store and the middleware chain that validates each request. | [auth-module.md](auth-module.md) |
```

1. Walk the docs root for `.md` files; skip `INDEX.md`, the plan folders and navigation-only
   files.
2. Include every doc with a valid `name` and `description`, alphabetically by `name`.
3. A doc without valid frontmatter is skipped, not half-listed: give it frontmatter now (it
   is a doc of this project, so it gets the same treatment as a migrated one), never abort
   the regeneration because of it.
4. Zero qualifying docs: no `INDEX.md`.

If the project checks its docs against the code (a docs lint, a link check), run it after
writing and fix what it reports.

## Red flags

| Thought or draft | Reality |
|---|---|
| "The work is done; I'll offer to document it" | Documenting is part of done. Write it, then report. |
| Asking the person where docs go, what to call one, or for a description | Yours to decide. |
| Adding frontmatter and an index to a project's existing docs unasked | Propose the switch once (Step 0); migrate only on a yes. |
| Listing a plan or a spec in the index | Plans describe unbuilt work; they never enter it. |
| "Since the migration…", "this PR", "temporary until…" | The system as it is; no process, no roadmap. |
| A link to a spec or a plan as a source | Temporary documents break; state the fact. |
| "Update: we changed X" appended to a section | Rewrite the section to be true now. |
| A description like "Docs for the billing module" | One specific sentence an agent can triage by. |
| Rewording a migrated doc's body | Migration prepends frontmatter and changes nothing else. |
| Product language and no file paths in a doc | Docs are engineering text; name things exactly. |
