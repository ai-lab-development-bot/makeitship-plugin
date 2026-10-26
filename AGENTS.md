# For agents working in this repository

This repository is a Claude Code plugin and its own marketplace (`.claude-plugin/`), with a Codex compatibility overlay (`.codex-plugin/`). `.mcp.json` declares one remote server, `makeitship`, over HTTP with no secrets — OAuth runs in the browser on first use.

- Skills live in `skills/<name>/SKILL.md`. Inside the plugin the server's tools are named `mcp__plugin_makeitship_makeitship__<tool>`; a person who added the server by hand sees `mcp__makeitship__<tool>`. Name the plugin form in skills.
- Bump `version` in both `plugin.json` files on every release: it is the update signal Claude Code compares.

Both ecosystems read the same `skills/`, so these hold at all times; breaking one ships a broken release:

- `version` is identical in `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`; both are bumped together.
- `description` is identical in both manifests.
- Every `SKILL.md` has at least `name` and `description` in its frontmatter — the only fields Codex requires.
- No skill exists for one ecosystem only: every skill lives in `skills/<name>/` and works in both.
- A `SKILL.md` hard-codes no tool-specific paths or harness-only tools; where one harness has a better tool (Claude's `Artifact`), the skill names it and says what the others do instead.
- No file the operating system drops into a folder is ever committed: `.DS_Store`, `Thumbs.db`, `desktop.ini`, `._*`. `.gitignore` ignores `.DS_Store`; check `git status` before every commit, and never `git add -A` or `git add .` over a folder you have not looked at. A tracked `skills/.DS_Store` broke the marketplace sync on claude.ai (2026-10-26); CI (`repo-hygiene`) fails a pull request that tracks one.
- Before a release: `claude plugin validate .`, a local `claude plugin marketplace add <path>` + install, the same with `codex plugin marketplace add <path>`, and a manual `create-task` run in each CLI.
