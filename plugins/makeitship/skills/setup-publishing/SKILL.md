---
name: setup-publishing
description: >
  Set up Makeitship's Publish for a project: after the person connects GitHub on the Releases
  page, add the deploy files for their host (Vercel, Netlify or Cloudflare Workers), a staging
  copy on the host, the host's key in GitHub and the host's own deploys turned off, check the
  work locally with the platform's own readiness checks, and ask Makeitship to check again until
  Publish is on. Every host step is checked against the host's current docs before it is done.
  The setup is a task; a hard case goes to a MakeItShip expert. Use when the person says "set up
  publishing", "make Publish work", "connect my deploys", "why is Publish off", "fix the
  checklist on Releases", or get_publish_readiness says the workspace is not set up, setting up,
  or needs attention and the person wants Publish. Never merges into the production branch, never
  starts a production deploy, never asks for a key in the chat.
---

# Set up publishing

Without the makeitship MCP server connected this skill does nothing: say so and point the person at the Connect agent page of their MakeItShip dashboard.

Tools, as the plugin exposes them: `mcp__plugin_makeitship_makeitship__get_publish_readiness`, `…__check_publish_readiness`, `…__check_host_access`, `…__list_tasks`, `…__create_task`, `…__update_task`, `…__add_task_comment`, `…__add_task_resource`, `…__list_task_statuses`, and the ones `work-on-task` uses to take a task through (`get_agent_rules`, `get_task`, `get_task_insights`, `get_house_rules`).

**Publish** puts a project live from Makeitship: a person presses it on the Releases page, Makeitship merges staging into the production branch, tags the version and runs the project's production deploy. It is on only when the Releases checklist is complete. This skill gets a project there. The Makeitship rules hold throughout: every change through a branch and a pull request into staging; never a push or a merge into the production branch; never a production deploy.

## Who you are working for

The person is most likely the product owner, not an engineer. They want Publish to work; GitHub settings, workflow files and host tokens are not their language. Everything that can be done in the repository is yours: you decide it, do it, and say what you did in a sentence. What only they can do — connecting GitHub, merging into the production branch, creating a key on the host, removing a GitHub app's access — reaches them as one short step at a time: where to click, what they will see, what it is for, in their words. Never ask them to paste a key, a token or a password into the chat.

## Facts come from the docs, not from memory or from this skill

Hosts and GitHub change their menus, their CLIs and their limits. Before every step on a host or on GitHub, open the page `references/hosts.md` links for it and check that it still says what the step assumes. When the page and the skill disagree, follow the page and tell the person this skill's guide is out of date on that point. A line marked *not confirmed* in `references/hosts.md` is a guess to check, never something to tell the person as a fact. Never fill a gap from memory: read the docs, or ask the person, or hand the case to an expert.

## 1. The setup is a task

Find the open task about setting up publishing (`list_tasks`; a task created by **Ask an expert** is titled "Connect GitHub and set up publishing") or create one through `create-task`. A task assigned to `expert` is the MakeItShip team's: do not start it (the `work-on-task` rule). Take the task through `work-on-task` as usual — its insight, a comment when something the person must know happens, every pull request attached — with one exception to its statuses: the setup task is done when Publish is on, not when your pull request reaches staging. It stays in progress while you work, in review while a step of the person's is open, and moves to done when `state` is `publish_on` (§8).

## 2. Read where the project stands

Call `get_publish_readiness`. Its `state` and checklist tell you what is left:

- **`publish_included` is false** — the workspace's plan does not include Publish. Tell the person what `plan_note` says and stop: no task, no setup. The refusal is final.
- **not_set_up** — the repository is not connected. Connecting is the person's: on the **Releases** page, **Connect GitHub**, choose the repository, then **Set it up** (Makeitship protects the production branch, adds `staging`, a `production` environment and read-only defaults for automated jobs). Say it in those words and wait; then read the state again.
- **setting_up** or **needs_attention** — work through the items that block, in the checklist's order: every `red` item, and `host_autodeploy_off` yellow `host_access_unchecked`. A yellow `protection` (GitHub does not enforce it on this plan) and a neutral `rollback_ready` (nothing is live yet) do not block. `unknown` means GitHub did not answer: check again later. `pending` is the test deploy running: wait. `references/hosts.md`, "Who fixes what", says who fixes each item and how; an item that is not there is a hard case (§9).
- **publish_on** — nothing to set up. If the person expected something else, show them what the checklist says.

## 3. Know the project

From the repository: the host (`references/hosts.md`, "Which host"), the package manager (from the lockfile), the Node version, the build command and its output folder. Ask the person only what the files do not tell you, in one message. A project on another host, a Cloudflare Pages project, or a wrangler config with `routes` or a custom domain is a hard case (§9).

## 4. The deploy files

On a branch cut from the latest `staging`:

1. Copy the three caller files for the host from `templates/<host>/` at the `v1` tag of https://github.com/ai-lab-development-bot/makeitship-actions — `deploy-production.yml`, `deploy-staging.yml`, `rollback.yml` — into `.github/workflows/`. Not `bootstrap-markers.yml`: Makeitship records what is live itself.
2. Replace every `__PLACEHOLDER__` with the project's value (`references/hosts.md` says where each one is found); the build options are in the README of that tag. Change nothing the README lists under "What MakeItShip depends on".
3. Check them locally (§6), then push and open a pull request into `staging`, attached to the task. Merge it when the project lets you (`work-on-task`).

## 5. On the host and on GitHub — the person's steps, one at a time

Each step: say what it is for, link the exact page, list the clicks, wait for "done", then check (§6).

- **A staging copy on the host.** The stable staging address (`references/hosts.md`, per host) and the app's own settings for staging — its environment variables and keys. Ask the person where staging's data should come from; never point staging at production's data without their explicit yes. On Vercel, explain who can open staging and let them choose (`references/hosts.md`); write the choice on the task.
- **The host's key in GitHub.** They create it on the host, then add it on GitHub under the exact name the deploy files use (`references/hosts.md`, "Keys on GitHub"): in the `production` and `staging` environments when the repository has them, otherwise as a repository secret. You never see the value; the check sees only the name.
- **The host's own deploys off.** They remove this repository from the host's GitHub app (`references/hosts.md`, "Turning off the host's own deploys"); disconnecting it on the host as well is tidy, not required. MakeItShip cannot see GitHub apps, so the Releases checklist asks the person to tick "I checked: <host>'s app doesn't have access to <repo>", and Publish stays off until it is ticked. Tick it for them with `check_host_access` (`checked: true`) only when they told you it is done, or you saw it yourself; it is recorded as ticked by the agent. If they are not sure, they tick it on Releases after looking.

## 6. Check your work locally

Run the platform's own checks on your working tree, before you push:

```
node <this skill's folder>/scripts/verify-publishing.mjs --local .
```

It needs Node and reads GitHub with the person's GitHub login (`GH_TOKEN`, `GITHUB_TOKEN` or the `gh` CLI); without one it still checks the deploy files and says what it could not read. It prints JSON:

- `local_files` — the three deploy files on their own (a leftover `__PLACEHOLDER__` is red);
- `items` — the checklist as Makeitship would see it, with the deploy files at `staging` taken from your working tree;
- `syntax` — `actionlint` over the files when it is installed;
- `exit_code` — the same as the script's exit status: 0 when nothing is left for you, 1 when something is, 2 for a wrong option or no GitHub repository. `deploy_files` waiting for the merge into the production branch and the host access box are the person's steps and do not count.

Fix what is red in the files, run it again, and only then push. What it cannot fix — a missing key, a setting only an admin can see ("Your GitHub account can't read this") — becomes a step for the person (§5).

## 7. Ask Makeitship to check again

After the deploy files reach staging and after each step of the person's, call `check_publish_readiness`. It is the Releases page's **Check again**: at most once every 30 seconds (a call inside that window answers the last result with `throttled: true`), and once everything else is in place it starts the one test deploy of staging. Tell the person what turned green and what is next. It never deploys production and is not a way to deploy staging.

## 8. The merge into the production branch is the person's

When `deploy_files` is red with reason `not_merged` (on Releases: **Bring the deploy files on main up to date**) and everything before it is in place, the person presses **Prepare the merge** on Releases, opens the pull request on GitHub and merges it (**Merge pull request** → **Confirm merge**). You never merge it, and never open a pull request into the production branch for it. If GitHub cannot merge it, the deploy files on staging conflict with main: bring them in line with main through a pull request into staging, then ask the person to press **Prepare the merge** again. Anything else is a hard case (§9).

Then `check_publish_readiness` once: the test deploy of staging starts. Follow it with `get_publish_readiness`, which only reads, every few minutes until `test_deploy` is no longer `pending` — Makeitship marks it `unknown` / `timed_out` after 20 minutes; only then call `check_publish_readiness` again. When `state` is `publish_on`, Publish is on. Comment on the task what was set up and the staging address, move it to done, and tell the person they can now publish from Releases.

## 9. A hard case goes to an expert

When a step fails twice, a host or a GitHub plan blocks it, the project is outside what the deploy files support, or the person asks: recommend handing the setup to a MakeItShip expert. On their yes, `update_task` with `assignee: "expert"`, and `add_task_comment` "Where setup stopped": what is done, what is left (the last local check in plain words), what the person already did. Tell them the MakeItShip team will contact them about it. Never name a GitHub account or ask them to invite anyone: the team arranges access with them. Once assigned to an expert, the task is the team's (`work-on-task`).

## Red flags

| Thought | Reality |
|---|---|
| "I'll merge the deploy files into main myself, it's only workflow files" | The production branch changes only through the person's merge or Publish. |
| "Paste the token here and I'll add it" | Keys go from the host straight into GitHub, by the person. Never through the chat. |
| "I know where this setting is in Vercel" | Open the page in `references/hosts.md` and check. Menus change. |
| "The host's app is probably not installed, I'll tick the box" | Tick it only on the person's word or what you saw. |
| "Keep the host's previews too" | Staging replaces them; the host's own deploys go off entirely. |
| "check_publish_readiness will redeploy staging for me" | It starts the one test deploy once everything else is in place, and never deploys on request. |
| "Staging can use the production database for now" | Only with the person's explicit yes. |
| "The setup failed again; I'll try a third way" | Two failures are a hard case: offer the expert. |
| "Everything green but the rollback item — still waiting" | `rollback_ready` is neutral until something is live, and a yellow protection does not block. Publish is on when `state` is `publish_on`. |
