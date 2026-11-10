# Sanity

Read this when the project uses Sanity (`sanity`, `@sanity/client`, `next-sanity` in the dependencies; a `sanity.config.*`; `SANITY_PROJECT_ID`; GROQ queries; images from `cdn.sanity.io`).

## Sanity's own agent tools

Sanity publishes its own tools for agents, the [Sanity Agent Toolkit](https://github.com/sanity-io/agent-toolkit):

- **its skills** hold Sanity's best practices for development on Sanity: schema and content modelling, queries, Studio, and the rest of the work on a Sanity project. They are the first-class rules for that work; read the one that matches the step before you take it.
- **its MCP server** (`https://mcp.sanity.io`, signed in with the person's Sanity account) lets the agent work with the project through Sanity itself: read and write content, read and deploy the schema, and read Sanity's current rules and docs.

What the toolkit contains and how its tools behave is Sanity's to say and changes over time: learn it from the toolkit and its tools, not from this file.

**Check that it is there** before the work: the toolkit's skills are among your skills, and the Sanity MCP tools answer. When either is missing, give the person the steps for the agent they use (below), as `work-with-cms` §3 says.

## Installing it, by agent

The toolkit's README is the source of truth for these steps; when it says otherwise, follow it.

- **Claude Desktop and claude.ai**: Customize → Plugins → find **Sanity** → install it, then authorize its connector (sign in to Sanity when it asks). Start a new conversation afterwards.
- **Claude Code, Codex, Cursor and other agents**: follow the installation section of the toolkit's README for that agent.
