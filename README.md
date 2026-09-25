# Makeitship plugin

Hand work to the Makeitship team as tasks, and follow their replies, from the agent you already use. The plugin adds the Makeitship MCP server and two skills; approving the connection happens in your browser the first time — no keys to paste.

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

- `delegate-task` — hands a piece of work to the team as a task, with a title, the context and what done looks like.
- `track-tasks` — the status of your delegated tasks, the team's replies, a comment back.

Both need the server connected; without it they say so.

## Without the plugin

Add the server yourself with the server URL from the Connect agent page of your Makeitship dashboard: `claude mcp add --transport http --scope user makeitship <url>`, or `codex mcp add makeitship --url <url>` then `codex mcp login makeitship`. Claude Desktop: Customize → Connectors → Add custom connector with the same URL.

## Versioning

Semantic versions in the manifests. Tools are only added or gain optional fields; a rename is a new tool plus the old one marked deprecated in its description for one minor release.
