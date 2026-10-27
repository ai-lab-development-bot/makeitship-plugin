---
name: track-tasks
description: >
  Read the Makeitship board — what is open, what a task says, what it is linked to, the
  replies on it — and comment, move, link or attach to a task; when the person asks "what
  is on the board", "what is still open", "any news from Makeitship", "what did the team
  say", "move this to done", "this is part of #12", "attach the PR to the task", or wants
  to answer a reply.
---

# Track the tasks on the Makeitship board

Without the makeitship MCP server connected this skill does nothing: say so and point the person at the Connect agent page of their Makeitship dashboard.

Tools, as the plugin exposes them: `mcp__plugin_makeitship_makeitship__list_task_statuses`, `…__list_tasks`, `…__get_task`, `…__add_task_comment`, `…__update_task`, `…__delete_task`, `…__add_task_relation`, `…__remove_task_relation`, `…__add_task_resource`, `…__remove_task_resource`.

## A task is its number

Every task has a `number`, shown as `#12` on the board, and that is how a task is named — to the person and to the tools. `get_task`, `update_task`, `add_task_comment` and `delete_task` take `number`. "Task 12", "#12", "the twelfth one" is `get_task` with `number: 12`. "The task about the DNS" is `list_tasks` with `search` (it matches the title and the description; `12` or `#12` also matches the number), then the one whose title or description fits — ask when two could. Say a task back as `#12` followed by its title; never by any other identifier. When an answer carries the task's `url`, make that name the link — `[#12 Title](url)` opens the task on the board — wherever one task is the subject; a list stays plain lines.

## The statuses are the workspace's own

Call `list_task_statuses` first, once per conversation. It answers the board's columns in order — each with a `slug` (the technical name every other tool takes), a `name` (what the person sees), `is_default` (where a new task lands) and `is_final` (a finished column). Never assume a status exists: a workspace renames, recolours, adds and removes its own. Speak to the person in the `name`; pass the `slug` to the tools.

## What is open

`list_tasks` returns one status at a time, in the board's manual order unless you ask for another (`order`: `position`, `created_desc`, `created_asc`, `priority`). "What is open" is every status that is not final: call `list_tasks` once per non-final status, in board order. Finished work is the final statuses; list those only when the person asks. If the person names a status, list that one only. Summarise as one line per task — `#12 Title`, status name, created date, and "with a Makeitship expert" when its `assignee` is `expert`. "What did I hand to the experts" is `list_tasks` with `assignee: "expert"`, once per status. Do not paste descriptions.

## What a task says

For a task the person names, call `get_task` with its `number` and read its description, its status, its comments, and what it is linked to. Report what a reply said in its own words where it matters (a question, a decision needed), and say what the person has to do next, if anything.

**A task on the Makeitship board comes with its Development Insights**, and `get_task` says so in its `insight` summary. Whenever you read a task to work on it — not only to answer what it says — take it through `work-on-task`: its insight read before the plan (`get_task_insights`), every point a step of the plan, done or disputed and reported, and the task moved to the status its outcome deserves. A task from this board is never worked without its insight.

## What a task is linked to

`get_task` answers two lists besides the comments. `relations` — the other tasks this one is linked to, each with a `kind`, a `direction`, and the other task's `number`, `title` and `status`:

| `kind` | `direction: out` | `direction: in` |
|---|---|---|
| `subtask` | the other task is a sub-task of this one | this task is part of the other one (its parent) |
| `blocks` | this task blocks the other one | this task is blocked by the other one |
| `related` | related, no direction | related, no direction |

`resources` — links on the task (a pull request, a document, a design), each with a `url`, an optional `title` and a `kind`.

Say them back in one line each, as the person would: "part of #12 Title", "sub-tasks: #13 Title (Done), #14 Title (To do)", "blocked by #9 Title", "blocks #15 Title", "related: #7 Title", then the links by title. Say a sub-task's or a blocker's status name when it matters to what the person can do next — a parent whose sub-tasks are all in a final column, a blocker still open. Leave out a list that is empty.

A relation is a hint for people and agents, never a rule: it does not move a task, it does not stop one from moving, and it is not a reason to refuse anything the person asks. Say "blocked by #9, which is still open" and let them decide.

## Linking and attaching

When the person says how two tasks relate — "#13 is part of #12", "#9 blocks this one", "these two are related" — call `add_task_relation` with this task's `number`, the other task's `related_number`, the `kind` and the `direction` from the table above (`out` is the default: this task is the parent or the blocker). Find both numbers first (`list_tasks` with `search` when they named a task by its words). When the person gives you a link for a task — a pull request, a document, a design — call `add_task_resource` with the `number`, the `url` and a short `title`; a link you produced yourself while working on that task (the pull request you opened, the document you wrote) goes on the task the same way, and you say so.

Link only what the person said or what you did for that task; do not infer relations from titles. The tool refuses a link that already exists, a task linked to itself, and a task with too many links — say the refusal back; do not retry it. Remove a relation (`remove_task_relation`, the same two numbers and `kind`) or a link (`remove_task_resource`, the `number` and the `url`) only on an explicit ask; say it back as `#12 Title` first.

## Commenting and moving

When the person answers a question or adds information, call `add_task_comment` with the task's `number` and their words as Markdown. Confirm it was posted. Hand a task to the Makeitship team when the person says to (`update_task` with `assignee: "expert"`), and back to the agent the same way with `"ai"`; confirm it in one line. Move a task when the person says to (`update_task` with the `number` and `status` = the slug of the column they name), and move the tasks you work on yourself, as the work goes, the way `work-on-task` says: into work when you start, to review or done by the outcome. Do not ask before a move that is part of the work. A move answers `insight_open` when points of the task's insight still have no report: close them (`work-with-insights`). If a status slug is refused as unknown, call `list_task_statuses` again — the workspace changed it — and ask which column the person means.

## Deleting

Only on an explicit "delete this task": name the task back to the person as `#12 Title` and ask them to confirm, then call `delete_task` with its `number`. Deletion is permanent.
