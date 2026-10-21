---
name: track-tasks
description: Read the Makeitship board — what is open, what a task says, the replies on it — and comment or move a task; when the person asks "what is on the board", "what is still open", "any news from Makeitship", "what did the team say", "move this to done", or wants to answer a reply.
---

# Track the tasks on the Makeitship board

Without the makeitship MCP server connected this skill does nothing: say so and point the person at the Connect agent page of their Makeitship dashboard.

Tools, as the plugin exposes them: `mcp__plugin_makeitship_makeitship__list_task_statuses`, `…__list_tasks`, `…__get_task`, `…__add_task_comment`, `…__update_task`, `…__delete_task`.

## The statuses are the workspace's own

Call `list_task_statuses` first, once per conversation. It answers the board's columns in order — each with a `slug` (the technical name every other tool takes), a `name` (what the person sees), `is_default` (where a new task lands) and `is_final` (a finished column). Never assume a status exists: a workspace renames, recolours, adds and removes its own. Speak to the person in the `name`; pass the `slug` to the tools.

## What is open

`list_tasks` returns one status at a time, in the board's manual order unless you ask for another (`order`: `position`, `created_desc`, `created_asc`, `priority`). "What is open" is every status that is not final: call `list_tasks` once per non-final status, in board order. Finished work is the final statuses; list those only when the person asks. If the person names a status, list that one only. Summarise as one line per task — title, status name, created date. Do not paste descriptions.

## What a task says

For a task the person names, call `get_task` and read its description, its status and its comments. Report what a reply said in its own words where it matters (a question, a decision needed), and say what the person has to do next, if anything.

## Commenting and moving

When the person answers a question or adds information, call `add_task_comment` with their words as Markdown. Confirm it was posted. Move a task between statuses only when the person says to (`update_task` with `status` = the slug of the column they name); the person and the Makeitship team move tasks otherwise. If a status slug is refused as unknown, call `list_task_statuses` again — the workspace changed it — and ask which column the person means.

## Deleting

Only on an explicit "delete this task": name the task back to the person and ask them to confirm, then call `delete_task`. Deletion is permanent.
