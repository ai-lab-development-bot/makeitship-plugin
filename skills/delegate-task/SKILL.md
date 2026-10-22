---
name: delegate-task
description: Create a task on the Makeitship board from this conversation — when the person says "create a task", "track this", "put this on the board", "hand it to Makeitship", "delegate this", or when a change needs someone else (infrastructure, access, design, a decision, the Makeitship team, something outside the repository). Creates the task through the makeitship MCP server and reports back.
---

# Create a task on the Makeitship board

Without the makeitship MCP server connected this skill does nothing: say so and point the person at the Connect agent page of their Makeitship dashboard.

A task is a unit of work the workspace tracks on its board, whoever does it: the person, you, or the Makeitship team. Create one when the person asks to track something, when work has to wait for someone else, or when a change needs a person at Makeitship.

## Gather, then create

1. **Title** — one line a stranger understands. Not "fix it": "Point www.acme.com at the new load balancer".
2. **Context** — what you tried, where it lives (paths, URLs, error text), and who it is for — the person, you, or the Makeitship team — and why.
3. **Definition of done** — what the person should be able to observe when the task is finished.
4. **Priority** — `low`, `medium` or `high`; default `medium`, `high` only when the person is blocked.
5. **Status** — leave it out unless the person names a column: the task lands on the workspace's default status. If they do name one, call `list_task_statuses` (as the plugin exposes it: `mcp__plugin_makeitship_makeitship__list_task_statuses`) and pass that column's `slug`.

Ask for anything missing in one question, not several. Then call `create_task` (`mcp__plugin_makeitship_makeitship__create_task`) with:

- `title`, `description_md` (context + "Done when: …" as Markdown), `priority`, and `status` only when the person named a column
- `idempotency_key` — generate one unique string (a random id, or the triggering message's id) when you first decide to create this task, and reuse that same string if you retry the call, so a retry never creates the task twice and two different requests never collapse into one.

## Formatting the description

`description_md` is Markdown; the task view renders it as blocks the person can read and edit. Write it so it reads well:

- Headings start at `##` — the title is the H1. Use them to separate the context from what done looks like.
- When done has several observable parts, write it as a to-do list, one `- [ ]` per part.
- Facts that differ per environment go in a GFM table (`| Env | Host | Owner |`).
- One `> [!TIP]` callout, for the one thing the person must not get wrong. Not more.
- Commands and error text go in fenced code blocks.
- Link with `[text](url)`. A screenshot or diagram is `![what it shows](public url)` — only a URL anyone can open; never a path on the box, and never a file.
- Plain Markdown only: no raw HTML, no `<details>`, no emoji callouts, no `#` heading.
- The limit is 20 000 characters; shorter is better.

Example:

```markdown
## Context
The deploy from `main` failed at the DNS step; `www.acme.com` still points at the old host (`203.0.113.10`). This needs the Makeitship team: the DNS zone is theirs.

| Env | Host | Owner |
| --- | --- | --- |
| production | lb-prod.acme.com | Acme IT |

> [!TIP]
> Change the A record, not the CNAME on `acme.com` — the apex must stay as it is.

## Done when
- [ ] `dig www.acme.com` answers with the new load balancer
- [ ] https://www.acme.com serves the new build
```

## Report back

Tell the person the task was created as `#12 Title` — the task's number (the `number` in the answer, shown as `#12` on the board) and its title — and the column it landed in, and that replies appear as comments they can read with `track-tasks`. The number and the title are how people know a task; never name it by any other identifier. Do not poll; the person asks when they want an update.

## When the call is refused

- "not in your plan" or a quota message — repeat the tool's message verbatim; the person decides.
- "unknown status" — the workspace changed its columns: call `list_task_statuses` again and ask which column the person means.
- an authentication error — the connection needs a fresh approval: `/mcp` in Claude Code, `codex mcp login makeitship` in Codex.
