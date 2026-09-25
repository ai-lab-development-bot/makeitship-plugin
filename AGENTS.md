# For agents working in this repository

This repository is a Claude Code plugin and its own marketplace (`.claude-plugin/`), with a Codex compatibility overlay (`.codex-plugin/`). `.mcp.json` declares one remote server, `makeitship`, over HTTP with no secrets — OAuth runs in the browser on first use.

- Skills live in `skills/<name>/SKILL.md`. Inside the plugin the server's tools are named `mcp__plugin_makeitship_makeitship__<tool>`; a person who added the server by hand sees `mcp__makeitship__<tool>`. Name the plugin form in skills.
- Bump `version` in both `plugin.json` files on every release: it is the update signal Claude Code compares.
- Before a release: `claude plugin validate .`, a local `claude plugin marketplace add <path>` + install, the same with `codex plugin marketplace add <path>`, and a manual `delegate-task` run in each CLI.
