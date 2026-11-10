# Sanity

Read this when the project uses Sanity (`sanity`, `@sanity/client`, `next-sanity` in the dependencies; a `sanity.config.*`; `SANITY_PROJECT_ID`; GROQ queries; images from `cdn.sanity.io`).

## Required: the Sanity Agent Toolkit

Work on a Sanity project needs Sanity's own agent tools, the [Sanity Agent Toolkit](https://github.com/sanity-io/agent-toolkit):

- **its skills**: the first-class rules for Sanity work, ahead of anything in `work-with-cms` about how Sanity works:
  - `sanity-best-practices` — GROQ, schema design, Visual Editing, images, Portable Text, Studio, TypeGen, localization, migrations, framework guides;
  - `content-modeling-best-practices` — structured content, references or embedding, reuse;
  - `seo-aeo-best-practices` — SEO and answer-engine content, structured data;
  - and the narrower ones the toolkit lists (experiments, singletons, Studio form components);
- **its MCP server** (`https://mcp.sanity.io`, OAuth): the agent reads and writes documents, reads and deploys the schema, manages releases and reads Sanity's own rules (`list_sanity_rules`, `get_sanity_rules`) through Sanity itself.

**Check that it is there** before the work: the toolkit's skills are among your skills, and the Sanity MCP tools answer (`whoami` names the account). When either is missing, give the person the steps for the agent they use (below), as `work-with-cms` §3 says. The toolkit's README is the source of truth for these steps; when it says otherwise, follow it.

### Installing it, by agent

- **Claude Desktop and claude.ai**: Customize → Plugins → find **Sanity** → install it, then authorize its connector (sign in to Sanity when it asks). The plugin brings both the skills and the MCP server. Start a new conversation afterwards.
- **Claude Code**: `/plugin install sanity@claude-plugins-official` (when it is not found: `/plugin marketplace update claude-plugins-official`, then `/reload-plugins`). Sign in to Sanity on the first use of its MCP server (`/mcp`).
- **Codex**: `codex plugin marketplace add sanity-io/agent-toolkit`, install **Sanity** from that marketplace in the plugin directory, restart Codex.
- **Cursor**: `/add-plugin sanity` in the chat.
- **Any other agent**: the skills with `npx skills add sanity-io/agent-toolkit`, and the MCP server at `https://mcp.sanity.io` in the agent's MCP settings (OAuth); the toolkit's README has the exact form for each client.

`npx sanity@latest mcp configure` sets up the MCP server for Cursor, Claude Code and VS Code from a project.

## How the work goes in Sanity

The toolkit's skills hold the detail; these are the points `work-with-cms` relies on.

- **Which project and dataset.** `whoami`, `list_projects` and `list_datasets` before the first write; compare with the project's environment (`SANITY_PROJECT_ID`, the dataset name). The dataset the live site reads is written to only on the person's yes.
- **Schema: the files in the repository are the source.** When the project has a local Studio, change its schema files (and nothing in Sanity's cloud without them), then deploy so the content tools see it: `deploy_schema`, or the project's own `sanity schema deploy` / `sanity deploy`. Run a dry run first where the tool offers one. Taking over a schema in the cloud that the repository does not hold needs the person's explicit yes.
- **Ask first** (the toolkit's own rule) before changing `sanity.config.*` and before deleting a schema file.
- **Removing a field**: the deprecation path (read-only, then hidden, then removed after the content is migrated), never a straight delete.
- **Content writes are drafts.** `create_documents` and `patch_documents` write drafts (or versions in a release with `create_release` and `create_version`; call `create_version` before patching a document in a release). `publish_documents` puts drafts live: only on the person's yes. Publishing checks the required fields; custom validation is skipped through MCP, so check the document against the schema's rules yourself (`documents_validate` where available).
- **Prefer the MCP tools to scripts** for content; NDJSON or migration scripts are for bulk moves or when MCP is not there.
- **Queries**: GROQ through `defineQuery`; regenerate the types (TypeGen, `npm run typegen` or the project's command) after a schema or query change; no `any` for Sanity content.
- **Images**: through the image pipeline the project uses (`@sanity/image-url`, the framework's integration), with the hotspot and crop the editor set and a required alt text.
- **Preview**: when the project has Visual Editing or a preview route, check drafts there before asking the person to publish.
- **Tokens**: from environment variables only; never hard-coded, committed or pasted into the chat.
- **AI image tools** (`generate_image`, `transform_image`) spend the project's Sanity AI credits: use them only when the person asked for it.
