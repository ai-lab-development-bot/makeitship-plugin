---
name: work-on-task
description: >
  Take a Makeitship task through to its outcome: read the task and its Development Insights, move
  it into work, write a local implementation plan in which every insight point is a step at the
  stage where it belongs, build, close every point (done, or disputed with a reason), and move the
  task to the status its outcome deserves — done, waiting for review, or still in progress. Use
  whenever the person asks you to do, implement, fix, build, pick up or finish a task from the
  board: "do #12", "work on #12", "take the next task from To do", "finish #12", "implement the
  task about the DNS".
---

# Work on a task from the Makeitship board

Without the makeitship MCP server connected this skill does nothing: say so and point the person at the Connect agent page of their Makeitship dashboard.

Tools, as the plugin exposes them: `mcp__plugin_makeitship_makeitship__get_task`, `…__list_task_statuses`, `…__list_tasks`, `…__update_task`, `…__add_task_resource`, `…__get_task_insights`, `…__acknowledge_insight_item`, `…__report_insight_item`. A task is named by its `number` (`#12` → `12`), and said back as `#12` followed by its title (`track-tasks`).

A task is not an implementation plan. It says what to achieve; its insight says what this task asks beyond its description. The plan is yours to write, and the insight points are part of it.

## Who you are working for

The person is most likely the product owner, not an engineer. They asked for the task to be done; how it is done is yours.

- **The planning, the engineering and the board are yours.** The plan, the order of the work, the tests, which column the task sits in: you decide and you do not ask. Moving the task is part of doing it, not a favour to request.
- **What a user would see or pay for is theirs.** A decision the task leaves open that changes what the product does, or what it costs, reaches them as a proposition with a **Recommended** option and its reason, in product words, the way `create-task` settles open decisions.
- **Facts only they hold are asked once, in product words**: which column means what, when the board's names do not say it (below); an access or an account the work needs. One message, not a drip.
- **No ceremonial gates.** You do not show the plan for approval, and you do not ask "shall I start?". The person sees the work, the reports and the status.

## 1. Take the task

1. `get_task` with the task's number. Read the description, the comments, the relations and the `insight` summary it carries: how many points, how many have no report yet, whether the insight is stale.
2. `get_task_insights`, always, before you plan. On `status: "generating"`, wait a few seconds and read again; do not plan around an insight you have not seen. On `"unavailable"`, say so in one line and work on the task alone. How to read a point, judge it, and report on it is `work-with-insights`; follow it.
3. A task blocked by another open task, or with sub-tasks still open: say it in one line ("blocked by #9 Title, still open") and carry on unless the block makes the work impossible. A relation never stops you.
4. Move the task into work: `update_task` with the slug of the in-progress column (below). A task already there stays.

## The board's columns

The statuses are the workspace's own (`list_task_statuses`, once per conversation). You need three of them:

- **in progress**: the work has started (names such as "In progress", "Doing", "In work");
- **review**: the work is complete and waits for someone else's check or action (names such as "Review", "In review", "QA", "Testing");
- **done**: the work is complete and nothing is left to check; a final status (`is_final`) named such as "Done", "Completed", "Shipped". A final status that means the work was dropped ("Cancelled", "Won't do") is never yours to use for a finished task.

Map them from the names and the board's order. When a role has no column, or two columns could fit it and nothing tells them apart, ask once, in their words, with your recommended mapping: "Your board has no review column. When I open a pull request for #12, shall I leave it in In progress until it is merged (recommended), or move it to Done?" Remember the answer for the rest of the conversation.

## 2. Plan, locally

Write the implementation plan before you build. It lives with you: your todo list, or a plan file in your own working notes. It is not posted on the task, not attached to it, and not committed to the project. When another skill writes your plans (a planning or brainstorming skill), the plan is that skill's, and the insight points go into it all the same.

The plan holds:

1. **The steps of the work** the task needs: what to read, what to build, what to test.
2. **Every insight point, as a step of its own, at the stage where it belongs**: before planning, while planning, while building, while testing, while finishing (`work-with-insights` says how to place one). Each step carries the point's `title` verbatim, the skill its `solution_md` names, and "acknowledge, then report". Required and suggested points alike: a suggested point is a step too, whose first question is whether it applies.
3. **Two closing steps, always last**: "Close the insight" (Section 4) and "Set the status" (Section 5).

A point that has no place in this task is still a step: the step is to dispute it, with the reason against its intent.

## 3. Build

Work through the plan in its order.

- **Acknowledge a point when its step starts** (`acknowledge_insight_item`), and **report it as soon as its step ends** (`report_insight_item`), not at the end of the task: a report written when the work is fresh is accurate, and a point reported is a point that cannot be forgotten.
- **When the task's description changes while you work** (a comment says so, or `get_task` shows a stale insight), read the insight again, judge your earlier reports against the change (`work-with-insights`), and add any new point to the plan where it belongs.
- **Commit, push, open a pull request and deploy only as the project and the person allow.** A pull request you open, or a preview you publish, goes on the task as a link (`add_task_resource`), the way `track-tasks` attaches one.

## 4. Close the insight

Before you set the status, read `get_task_insights` again. The server's state is the truth, not your memory of the plan.

- Every point has a report: carry on.
- A point is `open` or only `acknowledged`: do it now, or dispute it with the reason against its intent. Leaving it silent is not one of the options.
- A point you cannot finish (an access is missing, a decision is the person's and still open) stays `acknowledged`, and the task is not done: it stays in progress (Section 5), and you say why in one line.

## 5. Set the status

Choose by the outcome of the work, then `update_task` with that column's slug:

| The outcome | Column |
|---|---|
| The work is complete and in place, with nothing left for anyone to check: merged into the main branch, released, or a change that needs no review (a setting applied, a document written and filed) | **done** |
| The work is complete and waits for someone else: a pull request opened and not merged, a build published to a preview or test environment for checking, a change waiting for approval | **review** |
| The work is not complete, or a point is still only acknowledged | **in progress** (it stays) |

When the change is later merged or released (the person tells you, or you see it), move the task from review to done.

The answer of `update_task` may carry `insight_open`: points of the insight with no report yet, or a note that the insight changed. Treat it as Section 4 not finished: close those points, then set the status again if the outcome changed.

Then tell the person, in a few lines: what was done, where to see it (the link), the status the task is in now and why, and one line per insight point (done, or disputed, and the reason).

## Red flags

| Thought | Reality |
|---|---|
| "The task is clear; I'll skip the insight" | `get_task_insights` before the plan, always. The points are part of the work. |
| "The task description is the plan" | A task says what to achieve. Write the plan, with every point in it. |
| "I'll post the plan on the task" | The plan is local. The board carries the status, the reports and the links. |
| "I'll report all the points at the end" | Report each point when its step ends; the end is where points get lost. |
| "A suggested point is optional" | It is a step whose first question is whether it applies. Do it or dispute it. |
| "This point does not fit; I'll leave it" | Dispute it with the reason against its intent. Silence is not an option. |
| "Shall I move the task to In progress?" | Moving the task is part of the work. Move it. |
| "PR opened, so the task is done" | Waiting for a merge or a check is review. Done is when nothing is left to check. |
| "Almost finished; Done is close enough" | Not complete is in progress, with one line on what is left. |
| "`update_task` mentioned open points, but the task has moved" | Close those points; the reminder means the work is not finished. |
| "The board has no review column; I'll pick something" | Ask once which column to use, with your recommendation. |
| "Shall I show you the plan before I start?" | No gate. Start; bring only the decisions that change what users see or pay. |
