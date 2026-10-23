---
name: work-with-insights
description: >
  Read a Makeitship task's Development Insights — the points the team's catalog raised for this
  task, each with what to take into account and why it matters — place each point at the stage of
  the work where it belongs, act on it through the skill it names, and report back per point. Use
  whenever you take a task from the Makeitship board, whenever a task's description changed while
  you work on it, and before you call a Makeitship task done; also when the person asks "what does
  the insight say", "what should I take into account on #12", "report on the insight points".
---

# Work with a task's Development Insights

Without the makeitship MCP server connected this skill does nothing: say so and point the person at the Connect agent page of their Makeitship dashboard.

Tools, as the plugin exposes them: `mcp__plugin_makeitship_makeitship__get_task_insights`, `…__acknowledge_insight_item`, `…__report_insight_item`. Each takes the task's `number` (`#12` → `12`); the two reporting tools also take a point's `title`, exactly as `get_task_insights` lists it.

## What an insight is

The team keeps a catalog of things worth taking into account when working on a task. Every task is read against that catalog by a model, and the entries that apply become the task's **insight**: a list of **points**. Each point has:

- `title` — the point's name, the only identity it has for you; report by it, never paraphrased;
- `verdict` — `required` (the model is confident the point applies) or `suggested` (it may apply); `score` is that confidence, 0–1;
- `solution_md` — **what to take into account**: the recommendation, which usually names a skill of this plugin to use (`makeitship:unit-testing`, `makeitship:design-directions`, …);
- `intent_md` — **why it matters**: the reason the team raised the point;
- `status` — `open`, `acknowledged` (you took it), `done` or `not_applicable` (you reported);
- `previous_report` — your own report on the same point from an earlier version of the insight, if any.

**A point is a hint with an intent, never a rule.** The team wrote the intent so that you can judge: read `intent_md`, decide whether the point serves this task as it actually is, and act or decline on that judgement. `required` means "we are quite sure this applies", not "do this regardless". Nothing on the task waits for your report; no person is blocked by a point you leave open. You are the only one who closes points — people read them.

## When to read

- **On taking a task.** Call `get_task_insights` right after `get_task`, before planning. The task's description and its insight are read together: one says what to do, the other what to take into account.
- **After the description changed.** A task edited while you work on it is read again by the catalog (`stale: true` on your next read, then a fresh version); points you already reported on may no longer hold, and new ones may appear. Read again whenever `get_task` shows a changed description, and once more before you call the task done.
- **`status: "generating"`** — the model is reading the task now. Wait a few seconds and read once more. Do not plan around an insight you have not seen.
- **`status: "unavailable"`** — no insight for this task (the catalog could not be read, or has not been written yet: `catalog_empty: true` on a ready one). Say so in one line and proceed on the task alone; never treat it as a failure of the task.

## Place each point in the work before you start

An insight usually carries several points, sometimes many, and they do not all belong to the same moment: one is about how to plan (read the docs first, review the spec), one about how to build (iterate the look on a canvas, write the reproducing test first), one about how to finish (look at it in the running app, leave the implementation docs). **The platform does not say when a point applies; you do**, because you see the task, the codebase and the state of the work, and you know the software development lifecycle.

So, having read the insight:

1. Read every point's `solution_md` and `intent_md`.
2. For each point, decide the stage of this task's work where it belongs — before planning, while planning, while building, while testing, while finishing, after — from the nature of the recommendation and the intent behind it. A point that names a skill belongs where that skill does its work.
3. Write that order down for yourself (your plan, your todo list) and work through the task in it. Keep to it: do not pull a finishing point forward or push a planning point to the end without a pressing reason, and when such a reason comes, say what it was in that point's report.
4. Two points that name the same skill are two reasons to use it, not two runs of it: one run, both reported.

## Act on a point

- **Acknowledge before you start it**: `acknowledge_insight_item` with the task's `number` and the point's `title`. It is idempotent; it tells the person reading the task that the point is in hand.
- **Use the skill the point names.** `solution_md` says what to take into account and usually which skill of this plugin does it (`makeitship:consult-project-docs`, `makeitship:decision-review`, `makeitship:design-directions`, `makeitship:unit-testing`, `makeitship:integration-testing`, `makeitship:web-ui-exploratory-qa`, `makeitship:idle-cpu-audit`, `makeitship:page-speed-audit`, `makeitship:document-implementation`). Invoke that skill as you would for the person; the point is the reason, the skill is the how. A point that names no skill is acted on by its own words.
- **A `previous_report` is your own earlier work** on the same point, from before the task changed. Judge whether it still stands: if the change did not touch what you did, report `done` again with a short summary that says so; if it did, do the work again.

## Report on every point

Before you call the task done, every point of the current insight has a report:

- `report_insight_item` with `status: "done"` and `summary_md` — what you did, in two or three sentences a person can check (which test, which doc, what the audit found, what you changed). Not "done".
- `report_insight_item` with `status: "not_applicable"` and `summary_md` — the reason, against the intent: why this task does not need the point. "Not relevant" is not a reason; "the change is copy only, there is no rule a test could pin" is.
- A point you acknowledged and then could not finish stays `acknowledged`, with one line to the person in the chat.

A report on a point the current insight does not have (the insight was regenerated under you) is refused with a message to read again: do, then report against the new version. Say the reports back to the person in one line each when you hand the task over.

## Red flags

| Thought | Reality |
|---------|---------|
| "`required` — so I must" | Required is the model's confidence that the point applies. The intent decides; read it and judge. |
| "I'll read the insight when I get to testing" | It shapes the plan. Read it right after the task, before you plan. |
| "I'll apply the points in the order they are listed" | The list is by confidence, not by stage. Place each point in the work first. |
| "I did the work; the reports can wait" | A point without a report reads as untouched to everyone else. Report before you hand over. |
| "Done." as a summary | A summary says what was done so that a person can check it. |
| "Not applicable — not relevant" | Give the reason against the intent, or do the point. |
| "The description changed, but my reports stand" | Read the new insight; judge each previous report against the change. |
| "The insight is generating; I'll plan without it" | Wait a few seconds and read again. |
| "A point names a skill I would not have chosen" | The point is the reason the team raised; use the skill, or say in the report why not. |
