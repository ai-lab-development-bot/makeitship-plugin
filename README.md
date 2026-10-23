# Makeitship plugin

Put work on your Makeitship board as tasks — for you, for your agent, or for the Makeitship team — and follow it, from the agent you already use. The plugin adds the Makeitship MCP server and its skills; approving the connection happens in your browser the first time — no keys to paste.

## Claude Code

```
/plugin marketplace add ai-lab-development-bot/makeitship-plugin
/plugin install makeitship@makeitship
```

Then `/mcp`, pick `makeitship`, and approve the connection when it opens platform.makeitship.com.

## Codex

```
codex plugin marketplace add ai-lab-development-bot/makeitship-plugin
codex plugin add makeitship@makeitship
codex mcp login makeitship
```

## Removing

`/plugin uninstall makeitship@makeitship` in Claude Code, `codex plugin remove makeitship@makeitship` in Codex — the server goes with the plugin. A server you added by hand: `claude mcp remove makeitship` / `codex mcp remove makeitship`.

## Board skills

- `create-task` — makes a well-formed task on your board from the conversation: decides whether it is a feature, an enhancement or a bug, investigates what the product does today and what the request entails — in the code when the agent is in the repository, otherwise in the running product through a browser (the way `web-ui-exploratory-qa` opens it), settles the open decisions with you as propositions, and writes the task in the format its type needs (a defect is reported differently from a feature). A decision you already took, or a document you bring, is taken as settled and linked, not reopened. Who does the task is a separate question.
- `work-with-insights` — reads a task's Development Insights (the points the team's catalog raised for it, each with what to take into account and why), places each point at the stage of the work where it belongs, acts on it through the skill it names, and reports back per point; a task from the board is never worked without its insight.
- `track-tasks` — reads the board by its own statuses, what a task says, what it is linked to (sub-tasks, a parent, what blocks it, related tasks, the links on it) and its replies; a comment back, a move between columns, a link between two tasks, a pull request or document attached to one.

Both need the server connected; without it they say so. The board's statuses are your workspace's own (rename, recolour, add your own under Task settings in the dashboard).

## Engineering skills

Development know-how the agent picks up on its own when the task calls for it. These need nothing from Makeitship: no server, no account — each works on its own in any repository.

- `unit-testing` — works out what a unit promises and writes or judges its tests against that: asserts the contract, leaves accidents alone, catches assertions that pass whatever the code does.
- `integration-testing` — holds several real parts to what they jointly promise (a flow and its database, components and their store), mocking only where the slice's own code ends. Builds on `unit-testing`.
- `web-ui-exploratory-qa` — explores a running web app in a real browser the way an experienced tester would, screen by screen and in both themes, against the Figma design or by experience — what a person would notice, not pixel-perfect verification: fixes the obvious styling slips itself and hands over everything that touches what users see or do as a defect with a proposed fix and its consequence. Needs the Chrome DevTools MCP (and the Figma MCP in design mode); the skill walks through their setup.
- `design-directions` — when something is easier judged by looking at it (a screen, a flow, a component, an icon or an illustration), puts several genuinely different directions side by side on a canvas, built from your product's own look, recommends one and iterates with you until one wins. Also the visual round of `create-task`, where a mock-up illustrates a task and never replaces its text.
- `idle-cpu-audit` — finds what keeps a page busy while nobody touches it (looping animations, marquees, video, 3D scenes, smooth-scroll and animation libraries), measures what each costs, fixes the ones a visitor cannot see first and brings you only the ones that would change what visitors see; without the code it measures the live site and proposes tasks. Every animation it touches, and every one built later, stops when nobody can see it. Needs Node.js and Google Chrome; the skill installs its own measuring scripts.
- `page-speed-audit` — finds what makes a page slow to appear and respond (the PageSpeed score and what real visitors get), fixes the causes a visitor cannot see first and brings you the ones that would change what they see; heavy elements such as 3D scenes start only where the device can carry them. Measures through Google's PageSpeed Insights and Chrome UX Report APIs — it asks you once for a free Google API key and says why. Without the code it measures and proposes tasks.
- `document-implementation` — keeps living reference docs of how each part of the product works and why, written as part of finishing every implementation, each listed in a `docs/INDEX.md` table. In a project that already keeps docs another way, it first proposes the index once and explains what changes.
- `consult-project-docs` — before work on something that exists, reads that table and loads only the few docs the task needs, so the agent neither works blind nor rereads everything.
- `decision-review` — a skeptical read of a specification, a task, an implementation plan or the code itself, at whichever point of the cycle it is: it settles every technical question on its own and brings you only the decisions that change what the product does, each as a proposition in product language.

## Without the plugin

Add the server yourself with the server URL from the Connect agent page of your Makeitship dashboard: `claude mcp add --transport http --scope user makeitship <url>`, or `codex mcp add makeitship --url <url>` then `codex mcp login makeitship`. Claude Desktop: Customize → Connectors → Add custom connector with the same URL.

## Versioning

Semantic versions in the manifests. Tools are only added or gain optional fields; a rename is a new tool plus the old one marked deprecated in its description for one minor release.
