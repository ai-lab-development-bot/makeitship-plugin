---
name: track-tasks
description: Status of the tasks delegated to the Makeitship team, the team's replies, and a comment back — when the person asks "any news from Makeitship", "what did the team say", "what is still open", or wants to answer the team.
---

# Track the tasks delegated to Makeitship

Without the makeitship MCP server connected this skill does nothing: say so and point the person at the Connect agent page of their Makeitship dashboard.

Tools, as the plugin exposes them: `mcp__plugin_makeitship_makeitship__list_tasks`, `…__get_task`, `…__add_task_comment`, `…__update_task`, `…__delete_task`.

## Status

`list_tasks` returns one status group at a time and defaults to `new`. Call it once per group — `new` and `in_progress` for "what is open", plus `done` when the person asks about finished work; pass only the status the person names if they name one. Summarise as one line per task — title, status, created date. Do not paste descriptions.

## The team's replies

For a task the person names, call `get_task` and read its comments. Report what the team said in their words where it matters (a question, a decision needed), and say what the person has to do next, if anything.

## Answering the team

When the person answers a question or adds information, call `add_task_comment` with their words as Markdown. Confirm it was posted. Change a task's status only when the person says to (`update_task`); the team moves tasks otherwise.

## Deleting

Only on an explicit "delete this task": name the task back to the person and ask them to confirm, then call `delete_task`. Deletion is permanent.
