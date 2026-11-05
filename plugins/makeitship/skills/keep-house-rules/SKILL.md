---
name: keep-house-rules
description: >
  A workspace's Project rules: its rules (what holds for every task in this project) and its
  incidents (what already went wrong here, with the lesson each one teaches). Decide what deserves
  to be a rule, what is an incident and what is neither; read both lists first; propose the exact
  entry in the conversation and write it only after the person says yes; act on a refusal by
  fixing the entry, never by retrying it unchanged. Use when the person corrects you on something
  that will hold for future tasks ("don't do that again", "never … on this project"), explains
  what went wrong once its lesson is clear (a post-mortem; a broken thing is first a task, through
  create-task), states a lasting fact about the project (roles, environments, integrations, a
  constraint), or says "remember this", "add a project rule", "record this incident", "update
  the rule about…", "delete that rule", "what are project rules", "what is this for". Not for the Makeitship rules (get_agent_rules) or a
  task's insight points.
---

# Keep the Project rules

Without the makeitship MCP server connected this skill does nothing: say so and point the person at the Connect agent page of their Makeitship dashboard.

Tools, as the plugin exposes them: `mcp__plugin_makeitship_makeitship__get_house_rules`, `…__create_house_rule`, `…__update_house_rule`, `…__delete_house_rule`, `…__create_house_incident`, `…__update_house_incident`, `…__delete_house_incident`. They are offered only to a person's own agent; when they are missing, say in one line that Project rules are not available in this connection and carry on.

Every workspace keeps two short lists its agents read before work; people see them on the dashboard's **Project rules** page, with the tabs **Rules** and **Incidents**:

- a **rule** is one statement (at most 500 characters) that every agent follows on every task in this project;
- an **incident** is what happened (`description`, at most 1000 characters), the lesson it teaches (`takeaway`, at most 500) and how much it cost (`impact`: `critical`, `high`, `medium`, `low`).

At most 50 of each. Every agent connected to the workspace reads every entry, at the start of every task: an entry costs every future task its length, so the lists hold only what is worth that.

They are not the **Makeitship rules** (`get_agent_rules`, the same for every workspace, written by the Makeitship team) and not a task's **insight points** (`get_task_insights`, matched to one task). Never write either of those into the Project rules.

## Who you are working for

The person is most likely the product owner, not an engineer. The lists are theirs: what goes in them, in which words, is their decision, and nothing is written without their yes. Whether a moment deserves an entry, whether it is a rule or an incident, how it is phrased and which impact fits are yours to judge, and they reach the person as one ready proposal, not as questions.

## What it is for, in the person's words

When the person asks what Project rules are or what they are for, answer in their terms, not in tool names:

> Project rules are your project's memory for agents. Rules are what every agent should always keep in mind here; incidents are what already went wrong and what it taught. Every agent connected to your workspace reads them before each task, so you don't repeat the same correction to every new session, and a mistake that cost you once isn't made twice. You can see and edit them on the Project rules page; I add an entry only when you say yes.

Say it in the conversation's language and adapt it to what they asked; keep its substance. Do not promise more than that: not that other people can edit the lists, not that agents outside this workspace read them.

## 1. When to propose an entry

Propose one when:

- **the person corrected you** on something that will come up again ("no, real data only goes to staging"). The correction applies to the work at hand at once, whatever they answer to the proposal;
- **the person describes something that went wrong** — in production, a customer's report, a broken deploy, your own or another agent's mistake — and it teaches something beyond this one case. Something broken now is first a task (`create-task`); the incident is proposed once its cause and its lesson are clear;
- **the person states a lasting fact about the project**: who the users and their roles are, which environments exist and what each is for, a fragile integration, something never to do;
- **the person asks** ("remember this", "make it a rule", "record this incident").

Propose at the moment, briefly, then carry on with the work; do not hold the work up for it. One proposal per moment: when the person ignores it, do not raise it again.

## 2. A rule, an incident, or nothing

| It is | When | Example |
|---|---|---|
| **A rule** | A fact or a constraint that holds for every task in this project, whatever the task is | "Only staging takes real customer data; local and preview environments use the seed." |
| **An incident** | Something that happened, with a lesson that transfers to parts of the product it did not touch | Takeaway: "A migration that already ran in production is never edited; a fix is a new migration." |
| **Nothing** | Detail of the current task; what the code, the docs or the task already say; a one-off preference; something only true today | "Use a blue button here", "the build is red right now" |

An incident and a rule may come from the same moment: the incident keeps the story, a rule is added only when the lesson is a standing instruction the person wants followed always. Propose the incident; offer the rule only when the person's words make it one.

## 3. Read the lists first

Before any proposal, call `get_house_rules`; read it again before a later proposal, since the person may change the lists on the dashboard meanwhile. Then:

- **The same thing is already there** → propose nothing, or propose updating that entry when the new moment adds to it. When the person asked for the entry, tell them it is already there, quoting it.
- **A near entry is there** → propose updating or merging it rather than adding a second one. Two incidents with the same lesson are one incident; the store refuses a second entry with the same rule text or the same takeaway.
- **A list is full (50)** → say so with the proposal and propose which existing entry to merge or delete to make room.

## 4. Propose in the conversation, write on a yes

Show the exact entry, in the words that will be stored, and ask once. The first proposal in a conversation opens with one sentence on what Project rules are (the explanation above, shortened), since the person may not know them yet; later ones do not repeat it.

> I'd add this as a project rule, so every agent on this project follows it:
> "Only staging takes real customer data; local and preview environments use the seed."
> Shall I add it?

For an incident, show all three parts:

> I'd record this as an incident, so every agent on this project checks for it:
> Takeaway: "A migration that already ran in production is never edited; a fix is a new migration."
> What happened: "An edited migration was skipped by the production deploy; staging and production schemas diverged and the next deploy failed."
> Impact: high — the release was blocked for a day.
> Shall I record it?

- **Yes** → write exactly what was shown (`create_house_rule { content }`, `create_house_incident { description, takeaway, impact }`), then say it is saved and that it is on the Project rules page.
- **Yes, with changes** → apply them and show the new text again; it is a new proposal, written on its yes.
- **No** → drop it. Do not argue and do not raise it again.

Updates and deletes are proposed the same way: name the entry by its text, show the new text or say it will be deleted, write on a yes (`update_house_rule { id, content }`, `update_house_incident { id, … }` with only the fields that change, `delete_house_rule { id }`, `delete_house_incident { id }`, the `id` from `get_house_rules`). A delete is permanent, and the proposal says so ("This deletes it for good; shall I?").

Never write without that yes, never write something other than what was shown, and never fold an entry into a write the person agreed to for another reason.

## 5. Write it well

- **Within the limits before you propose**: a rule or a takeaway over 500 characters, or a description over 1000, is shortened before the person sees it.
- **Short and atomic**: one fact or one constraint per rule; one lesson per takeaway.
- **Imperative or factual**: "Never edit a migration that ran in production", "The admin app is English only".
- **Self-contained**: an agent that never saw this conversation understands it. No "as above", "this file", "today".
- **A takeaway names the class of failure**, so it applies where the incident did not happen; the description keeps what happened, where, how it was noticed and what the analysis found.
- **Impact by what it cost**: `critical` — users lost data, money or access, or the product was down; `high` — many users hit it, or it took a release to fix; `medium` — some users, a workaround existed; `low` — caught before users, or cosmetic.
- **No secrets**: no keys, passwords, tokens, personal data. Every agent connected to the workspace reads the lists, and the dashboard shows them. Say where a secret lives, never what it is.
- **In the language the existing entries use**; for an empty list, the language of the conversation.

## 6. When a write is refused

The refusal is a sentence that says what is wrong and what to do. Act on it; never send the same entry again unchanged.

| The refusal says | Do |
|---|---|
| "… is 612 characters; the limit is 500. Shorten it and try again." | Shorten that field to fit, show the shortened text to the person — what they agreed to has changed — and write on their yes. |
| "… is empty. …" | Fill the field, propose again. |
| "impact must be one of critical, high, medium, low." | Pick one, say which and why, propose again. |
| "This rule (incident) already exists in this workspace. Update the existing one instead of adding it again." | Read the lists; when the existing entry says it, tell the person it is already there; otherwise propose updating it. A create retried after a timeout that answers this was saved the first time. |
| "This workspace already has 50 rules (incidents), the limit. Merge or delete an existing … first." | Read the lists and propose which entries to merge or delete; write only on a yes. Never delete anything on your own to make room. |
| "This rule (incident) is no longer in this workspace's list." | Read the lists again; tell the person when the entry they meant is gone, and propose again only if it still matters. |
| A refusal about access (the Makeitship team, an agent key, another workspace) | It is final. Tell the person what it says. |

## Red flags

| Thought | Reality |
|---|---|
| "It's obviously right; I'll just add it" | Nothing is written without the person's yes to the exact text. |
| "They said yes earlier; I'll tweak the wording and save" | A changed text is a new proposal. Show it again. |
| "I'll add it now and mention it later" | Propose first, write after. There is no draft state to fix it in. |
| "Every correction is a rule" | A rule holds for every task. Task detail, one-off taste and what the docs say are nothing. |
| "A new incident, close to an existing one" | Same lesson, one incident. Propose updating the existing entry. |
| "The list is full; I'll drop the oldest" | Propose merges or deletions; write only on a yes. |
| "Refused as too long; I'll send it again" | Shorten it, show it, write on the yes. Never retry unchanged. |
| "I'll put the API key in the rule so agents have it" | Every agent reads the lists. Say where it lives, never what it is. |
| "It's really a platform-wide rule or a task's point; I'll put it in the project rules anyway" | Different lists, different tools. Project rules are this workspace's own. |
| "They ignored the proposal; I'll ask again later" | One proposal per moment. |
