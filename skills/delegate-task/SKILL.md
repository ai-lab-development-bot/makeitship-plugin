---
name: delegate-task
description: Hand a piece of work to the Makeitship team as a task — when you cannot do it yourself (infrastructure, access, design, a decision, something outside the repository) or the person says "hand it to Makeitship", "delegate this", "ask the team". Creates the task through the makeitship MCP server and reports back.
---

# Delegate a task to the Makeitship team

Without the makeitship MCP server connected this skill does nothing: say so and point the person at the Connect agent page of their Makeitship dashboard.

## Gather, then create

1. **Title** — one line a stranger understands. Not "fix it": "Point www.acme.com at the new load balancer".
2. **Context** — what you tried, where it lives (paths, URLs, error text), and why it needs a person.
3. **Definition of done** — what the person should be able to observe when the task is finished.
4. **Priority** — `low`, `medium` or `high`; default `medium`, `high` only when the person is blocked.

Ask for anything missing in one question, not several. Then call `create_task` (as the plugin exposes it: `mcp__plugin_makeitship_makeitship__create_task`) with:

- `title`, `description_md` (context + "Done when: …" as Markdown), `priority`
- `idempotency_key` — generate one unique string (a random id, or the triggering message's id) when you first decide to create this task, and reuse that same string if you retry the call, so a retry never creates the task twice and two different requests never collapse into one.

## Report back

Tell the person the task was created, with its title and id, and that the team's replies appear as comments they can read with `track-tasks`. Do not poll; the person asks when they want an update.

## When the call is refused

- "not in your plan" or a quota message — repeat the tool's message verbatim; the person decides.
- an authentication error — the connection needs a fresh approval: `/mcp` in Claude Code, `codex mcp login makeitship` in Codex.
