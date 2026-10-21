# Makeitship plugin

Put work on your Makeitship board as tasks — for you, for your agent, or for the Makeitship team — and follow it, from the agent you already use. The plugin adds the Makeitship MCP server and two skills; approving the connection happens in your browser the first time — no keys to paste.

## Claude Code

```
/plugin marketplace add ai-lab-development-bot/makeitship-plugin
/plugin install makeitship@makeitship
```

Then `/mcp`, pick `makeitship`, and approve the connection when it opens platform.makeitship.com.

## Codex

```
codex plugin marketplace add ai-lab-development-bot/makeitship-plugin
codex plugin add makeitship@makeitship
codex mcp login makeitship
```

## Removing

`/plugin uninstall makeitship@makeitship` in Claude Code, `codex plugin remove makeitship@makeitship` in Codex — the server goes with the plugin. A server you added by hand: `claude mcp remove makeitship` / `codex mcp remove makeitship`.

## Skills

- `delegate-task` — creates a task on your board from the conversation, with a title, the context and what done looks like; handing work to the Makeitship team is one reason among others.
- `track-tasks` — reads the board by its own statuses, what a task says and its replies; a comment back, a move between columns.

The board's statuses are your workspace's own (rename, recolour, add your own under Task settings in the dashboard); an agent learns them with `list_task_statuses` and names one by its slug.

## Engineering skills

Development know-how the agent picks up on its own when the task calls for it. These need nothing from Makeitship: no server, no account — each works on its own in any repository.

- `unit-testing` — works out what a unit promises and writes or judges its tests against that: asserts the contract, leaves accidents alone, catches assertions that pass whatever the code does.
- `integration-testing` — holds several real parts to what they jointly promise (a flow and its database, components and their store), mocking only where the slice's own code ends. Builds on `unit-testing`.
- `web-ui-qa` — checks a running web app in a real browser, screen by screen, against the Figma design or by experience: fixes the obvious styling slips itself and hands over everything that touches what users see or do as a defect with a proposed fix and its consequence. Needs the Chrome DevTools MCP (and the Figma MCP in design mode); the skill walks through their setup.

Both need the server connected; without it they say so.

## Without the plugin

Add the server yourself with the server URL from the Connect agent page of your Makeitship dashboard: `claude mcp add --transport http --scope user makeitship <url>`, or `codex mcp add makeitship --url <url>` then `codex mcp login makeitship`. Claude Desktop: Customize → Connectors → Add custom connector with the same URL.

## Versioning

Semantic versions in the manifests. Tools are only added or gain optional fields; a rename is a new tool plus the old one marked deprecated in its description for one minor release. 0.3.0 is the one exception so far: statuses became the workspace's own, so a status is a slug from `list_task_statuses` and the fixed `new` / `in_progress` / `done` vocabulary of 0.2.x is gone (there were no production customers yet).
