# Sanity

Read this when the project uses Sanity (`sanity`, `@sanity/client`, `next-sanity` in the dependencies; a `sanity.config.*`; `SANITY_PROJECT_ID`; GROQ queries; images from `cdn.sanity.io`).

## Sanity's own agent tools

Sanity publishes its own tools for agents, the [Sanity Agent Toolkit](https://github.com/sanity-io/agent-toolkit):

- **its skills** hold Sanity's best practices for development on Sanity: schema and content modelling, queries, Studio, and the rest of the work on a Sanity project. They are the first-class rules for that work; read the one that matches the step before you take it.
- **its MCP server** (`https://mcp.sanity.io`, signed in with the person's Sanity account) lets the agent work with the project through Sanity itself: read and write content, read and deploy the schema, and read Sanity's current rules and docs.

What the toolkit contains and how its tools behave is Sanity's to say and changes over time: learn it from the toolkit and its tools, not from this file.

**It is required.** Effective work on a Sanity project goes through the toolkit: without it the agent cannot see what Sanity really holds or have its writes checked. **Check that it is there** before the work: the toolkit's skills are among your skills, and the Sanity MCP tools answer. When either is missing, ask the person to install it, with the steps for the agent they use (below), every time, as `work-with-cms` §3 says.

## Installing it, by agent

The toolkit's README is the source of truth for these steps; when it says otherwise, follow it.

- **Claude Desktop and claude.ai**: Customize → Plugins → find **Sanity** → install it, then authorize its connector (sign in to Sanity when it asks). Start a new conversation afterwards.
- **Claude Code, Codex, Cursor and other agents**: follow the installation section of the toolkit's README for that agent.

## First, before any content work: is the schema deployed

The Sanity MCP checks content against the schema **deployed** to Sanity, not against the Studio code in the repository. With no deployed schema:

- nothing checks what the agent writes: any field name, any value, a missing required field, a text over its limit is stored silently, and that part of the page renders empty;
- the agent cannot ask Sanity what content should look like, and without the code it guesses the structure from existing documents;
- Sanity's own document validation does not work.

So, before the first content write on a Sanity project, every time, with the Sanity MCP and for **each dataset the project uses** (staging and production):

1. **The schema.** Is a schema deployed, and does it match the schema in the code (its types and fields)? The code's schema is the base for the next checks.
   - **Deployed and current** → carry on.
   - **Missing or behind, and the project has no schema deploy** → before writing content, propose adding it (below), as a recommendation the person decides on. Until it is in place, work the safe way (below).
   - **Behind although the project has the schema deploy** → its last run failed or has not happened yet: look at its runs, and offer the person a manual run.
   - **Ahead of the code** (types the code no longer has) → usually a rollback: check 2 and the person's decision below.
2. **Content the current code cannot show.** Query (GROQ) for documents whose `_type` the code's schema does not know (system documents, `_.**` and the like, aside), and for documents whose sections or array items have an unknown `_type`, for example `*[_type == "page" && count(modules[!(_type in $knownModules)]) > 0]{_id, title}`. The known types come from the code's schema, or from the deployed one when it is current.
3. **The documents you are about to touch.** When the deployed schema is current, validate them against it with the MCP's document validation before you change them.

Content the code cannot show is easy to miss: the site does not fail (an unknown section is skipped and the page renders part-empty), and the Studio shows "unknown type" only to someone who opens the document, where an editor may delete it by accident. It usually means **the code went back and the content did not** (a rollback; below), or a type was removed without migrating its content.

**What to do about it is the person's decision, never yours.** Only they know why it happened and what comes next: a rollback may be a short detour before a fix that brings the code back, or the end of that feature. Show them what you found in plain words ("the Use cases page has three sections the site can no longer show; its links in the header and footer lead to a part-empty page"), say what it affects, and offer the choices with your recommendation:

- leave it as it is, because a release bringing the code back is coming;
- migrate it to the current structure;
- remove it: unpublish, then delete, only on their yes, after a dataset export or with the document history named as the way back.

Never delete, unpublish or rewrite it on your own, and do not build new content on top of it until they decide.

**Never reuse a removed type's name with a different meaning.** A schema deploy replaces the deployed schema, it does not merge, but old documents of a removed type stay in the dataset; a new type under the same name makes them render wrongly with no error. Pick a new name, and migrate or remove the old content deliberately (with the person, as above).

### Without the Sanity MCP: a trade-off, not an alternative

Only when the person has said to go on without the toolkit, or it cannot be installed here. Each of these gives fewer guarantees than the MCP, and the person hears which, for this piece of work:

- **The schema and the types** come from the Studio's schema files in the code.
- **The deployed schema and the content** are checked through the project's own Sanity CLI, when it is installed and signed in (its schema and document commands; check `npx sanity --help` and Sanity's CLI docs, https://www.sanity.io/docs/cli-reference, for the current ones). The same three checks, by hand.
- **With neither the MCP nor the CLI**: say plainly that the deployed schema and content the code cannot show were not checked, and that Sanity does not check what is written. Then work staging first and check every change on the rendered page (`work-with-cms` §7).

## The proposal, in the person's words

Say what it gives, not how it works:

> Your site's content structure lives only in its code, so Sanity cannot check what an agent writes. I'd add an automatic step that sends that structure to Sanity after each deploy (recommended):
> - every agent reads the exact content structure from Sanity itself, so it does not fill in pages by guesswork;
> - what an agent writes is checked against your rules before it is published, instead of a mistake silently leaving part of a page empty;
> - Sanity's own hosted tools see the same content types your site uses.
>
> It needs one thing from you: a Sanity deploy token saved in GitHub (I'll show you where). Shall I add it?

Say it in the conversation's language. On a yes, the change is a task of its own (`create-task`) and goes through a branch and a pull request into staging like any code (`work-on-task`).

## How the schema deploy works

A separate workflow file in the project, `.github/workflows/sanity-schema.yml`, follows the project's own code deploys and never takes part in them. `sanity-schema-workflow.yml` in this folder is the example to adapt.

- **Staging**: after the staging code deploy finishes successfully (every push to staging), GitHub starts the schema workflow on its own; it deploys the schema to the dataset the staging site reads.
- **Production**: after the production code deploy finishes successfully (each release), GitHub starts it again, for the dataset production reads.
- **No new step for anyone**: neither the person nor the release process does anything extra, and the release does not know the file exists.
- **A code deploy fails** → the schema is not deployed, so the live schema never runs ahead of the code.
- **The schema deploy fails** → the code is already live and stays live. The failure shows as a red run in GitHub Actions, and GitHub emails the person who started the deploy. The first-step check above catches it before the next content work.
- **A rollback** goes back in code only. It is not a content rollback, and it does not start the schema workflow: the deployed schema and the content stay ahead of the code until the next release. The first-step check is what catches it, and what to do about it is the person's call (above).

What makes it reliable, whatever else changes in the file:

1. **The file must be on the default branch (`main`).** GitHub only listens for `workflow_run` (and shows "Run workflow") from there. It starts working after the first release that carries the file to `main`; until then, nothing deploys the schema automatically.
2. **It deploys the schema from the exact commit that was just deployed** (`workflow_run.head_sha`), not from `main`. Otherwise a staging deploy would send `main`'s older schema.
3. **The names of the deploy workflows are a contract.** It listens for them by their `name:` ("Deploy Staging", "Deploy Production" in the MakeItShip deploy files). A rename stops the listener without an error, so the self-check compares the names.
4. **A manual run is always available** ("Run workflow", choosing the dataset and optionally a commit or tag), to repeat a failed deploy or to do the first one.

**Adapt it to the project**: other workflow names, other or more datasets, a different package manager, a Studio in a subfolder (`working-directory`), how the Studio config chooses its dataset (an environment variable, or one workspace per dataset with `--workspace`). Read the project's `sanity.config.*` and `sanity.cli.*` before choosing.

**Sanity's docs are the source of truth for the command and the token**; check them before writing the file, and follow them where they differ from the example:

- the CLI's schema commands: https://www.sanity.io/docs/cli-reference/cli-schema (in the project, `npx sanity schemas --help` confirms its installed CLI has them);
- schema deployment and the token it needs: https://www.sanity.io/docs/apis-and-sdks/schema-deployment;
- GitHub's `workflow_run`: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run.

**Setup steps** (the person's are one at a time, in their words; a token is never asked for in the chat):

1. The person creates a Sanity token with deploy rights in the project's settings at sanity.io/manage, and saves it as the `SANITY_DEPLOY_TOKEN` repository secret in GitHub.
2. The file reaches `main` with the next release.
3. One manual run per dataset deploys the schema the first time; then the first-step check confirms Sanity returns the schema for each.

## The self-check: the schema workflow must not touch code delivery

Required before the workflow is added to any project. Verify each point and record how (on the task, or in the pull request):

- [ ] The MakeItShip deploy files (`deploy-staging.yml`, `deploy-production.yml`, `rollback.yml`) are not changed in any way.
- [ ] A release still dispatches the production deploy exactly as before (same workflow, inputs, version tag and check of who may deploy), and staging still deploys on every push to staging.
- [ ] The schema workflow cannot fail, block, delay or undo a code deploy: it runs separately, and its failure shows only in its own run.
- [ ] It deploys to production's dataset only after the production code deploy has succeeded.
- [ ] It takes the schema from the deployed commit (`workflow_run.head_sha`), not from `main`.
- [ ] The workflow names it listens for match the project's deploy workflows exactly.
- [ ] Rollback works exactly as before, without the schema workflow.
- [ ] MakeItShip's Releases readiness checklist is unaffected.

## Until the schema deploy is in place

- Take content shapes from the schema files when the code is available: field names, types, required fields, limits.
- Write to staging first, render and check there, then copy the approved version to production (`work-with-cms` §7).
- Say plainly to the person that Sanity does not check what you write yet.
