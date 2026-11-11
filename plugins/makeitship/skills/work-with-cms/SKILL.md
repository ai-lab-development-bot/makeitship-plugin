---
name: work-with-cms
description: >
  Work on a project whose content lives in a CMS (Sanity first; others by their own docs): find
  out whether and which CMS the project uses, make sure the CMS's own agent tools are installed
  (its official skills and MCP server, the first-class rules for that CMS), and keep content
  where editors manage it — modelled in the CMS schema and written to the CMS as drafts, never
  hard-coded into components; content goes through staging first and reaches production with the
  release. Use before building a new page, section, block or layout on a site that has a CMS,
  before writing or changing content (copy, a blog post, a landing page's text, images), before
  changing a content schema, and whenever the person says "add it to the CMS", "put this in
  Sanity", "the editors should be able to change this", "write the post", "migrate the content",
  or the code shows a CMS client, a Studio or CMS queries. Publishing to the live site and
  writing to a production dataset are the person's decision.
---

# Work with a CMS

A site with a CMS has two places where its words and pictures can live: in the CMS, where the people who run the site change them without a developer, or in the code, where only a developer can. A page built with its text hard-coded looks finished and is wrong: the editors cannot touch it, and the next agent has to rebuild it. This skill keeps content where it belongs and makes the agent use the CMS's own tools to put it there.

## Who you are working for

The person is most likely the product owner, not an engineer. Schemas, queries, datasets and tokens are yours: you decide them and say what you did in a sentence. What reaches them is what they will see or what changes for the editors: which parts of a page their team can edit, a draft to review in the CMS, a publish that would put it on the live site. Facts only they hold (which dataset is live, who edits what, an account or an access) are asked once, in product words.

## 1. Does the project use a CMS, and which one

Look before you build or write anything:

- **In the code**: a CMS client or framework package in the dependencies (`sanity`, `@sanity/client`, `next-sanity`, `@sanity/image-url`, `contentful`, `@strapi/*`, `@storyblok/*`, `@prismicio/*`, `@payloadcms/*`, …), a CMS config or Studio folder (`sanity.config.*`, `sanity.cli.*`, `studio/`, `schemaTypes/`), CMS environment names (`SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, …), CMS queries (GROQ, a CMS GraphQL endpoint).
- **In the running product**, when there is no code: images served from a CMS's CDN (`cdn.sanity.io`, `images.ctfassets.net`, …), a CMS's preview or visual-editing markers.
- **In the task or the conversation**: the person or the task names the CMS.

No CMS → this skill does not apply; carry on. A CMS that only holds part of the site (a blog, but hard-coded marketing pages) → follow what the project already does for that part, and when new work could go either way, ask once (§4).

## 2. Read the reference for that CMS

| CMS | Read |
|---|---|
| Sanity | `references/sanity.md` |

Read it before the first step of the work, every time: it says which official agent tools the CMS has, what they are for, how to install them in each agent, and what to check in the project before the first content write (for Sanity: that its schema is deployed). A CMS with no reference here: work from that CMS's official documentation and its official agent tools, if it has any, under the rules below; say in one line that this skill has no guide for it yet.

## 3. The CMS's own agent tools come first

A CMS that ships official skills and an MCP server for agents knows its own data better than this skill does. Its skills are the first-class rules for that CMS: schema design, content modelling, queries, images, rich text, preview, migrations. Read the one that matches the step before you take it. Where they and this skill disagree on how the CMS works, theirs win; this skill keeps only the rules of the work: where content belongs, what the person decides, what you never do.

**When the tools are missing**, tell the person once, before the work, in their words: what is missing, what it gives (the agent works by the CMS's own best practices and reaches its content through the CMS itself), and the steps for their agent from the reference. Then:

- they install it → check it is there and carry on;
- they decline, or it cannot be installed here → carry on, and say in one line that you will follow the project's current code and its existing patterns instead, so something is more likely to be done incorrectly than with the CMS's own tools.

## 4. Where content belongs

- **What an editor would change lives in the CMS**: headings, body copy, calls to action, images, lists of items (features, team members, testimonials, posts), links that point at content, SEO titles and descriptions. A new page, section or block gets its content model (a document or object type, its fields) together with its layout, and the component reads from the CMS.
- **What belongs to the interface stays in the code**: labels of the UI itself (form errors, a "Close" button, pagination), layout, styles, behaviour. The project's own split wins when it has one: look at how existing pages do it before you decide.
- **Model, do not mirror the layout.** Name types and fields by what the content is (`testimonial`, `author`, `quote`), not where it sits (`leftColumnText`), so the same content can be used on another page. Reuse an existing type before adding a near copy.
- **When a piece could go either way** and the project does not settle it, ask once, as a proposition with a recommendation: "Your team edits the homepage in Sanity. I'd make the pricing table editable there too, so prices can change without a developer (recommended), or keep it in the code if it changes only with a release."

## 5. Changing a schema

- Edit the schema where the project keeps it (the Studio's schema files in the repository) and follow its existing patterns; deploy it only by the CMS's own procedure (the reference).
- **Adding is safe; removing and renaming are not.** A field or type that holds editors' content is never removed or renamed in one step: deprecate it, migrate the content, then remove it, by the CMS's own rules; the person hears in one line what changes for the editors.
- After a schema change, regenerate the project's content types when it keeps them, and update the queries that read the changed fields.

## 6. Writing content

- **Content the person asks for goes into the CMS, not the code**: a post, a page's copy, a new testimonial is created in the CMS as a draft, through the CMS's tools.
- **Drafts, not the live site.** Create and edit as drafts (or a release of drafts). On a staging dataset of its own, publish what you need to check on the staging site. Where the live site reads it, **publishing is the person's decision**: say what is ready, where to review it (the link to the document in the CMS's editor, a preview), and publish only on their yes to that publish.
- **Know which dataset you are writing to.** Confirm the project and the dataset (or environment) before the first write: the staging one (§7). Never write to the one the live site reads without the person's yes, and never delete content or a dataset on your own.
- **Real content, not placeholders.** A page built with lorem ipsum in the CMS is still unfinished; demo content is labelled as such and the person hears it is there.
- **Secrets stay out**: CMS tokens live in environment variables and the agent's own connection, never in the code, a commit, a task or the chat.

## 7. Content goes through staging, like the code

Code reaches the live site through staging (`work-on-task`): a branch, a pull request into staging, a check there, then a release. Content follows the same path. It is written and checked against the staging environment first, and reaches production with the release, never before it.

**Find out how content travels in this project, on the spot.** It is yours to work out, from the project itself: the CMS settings per environment (the dataset or environment names in the env files and the host's settings), the deploy workflows, migration or seed folders, the docs, how earlier content got to production. Ask the person once only when the project does not tell. The usual cases:

| How the project keeps content | What it means for the work |
|---|---|
| In the repository (Markdown, JSON, files the build reads) | It travels with the code; nothing more to move. Prefer the CMS when the project has one for that content (§4). |
| Created by migrations or seed scripts in the repository that run on deploy | Write the new content as such a migration, so the release carries it to production. |
| One dataset shared by staging and production | Nothing to move, but anything published shows on the live site at once, even before the code that renders it is released. Keep it as a draft, or in a release scheduled for the go-live, until the code is live. |
| A separate dataset per environment, with nothing that copies content between them | Content written on staging has to be moved to production after the code is released, with the CMS's own tools (an export and import, a copy, a migration script, its MCP). This move is a step of the work. |

**When content must be moved by hand**, it is part of going live, not an afterthought:

- keep the list of what was created or changed on staging (types, documents, assets) while you work;
- in the report and on the task, say what has to reach production, how, and in what order: the schema first, then the content, then the code that needs it;
- move it only after the code is live and only on the person's yes, since it writes to the dataset the live site reads; then check the live page.

**Code that reads new content tolerates its absence**: between the code release and the content move, production has the code without the content. An empty field, a missing document or an unknown type must not break the page.

**Deploys take time.** A merge into staging reaches the staging site only when its deploy finishes; a statically built site may show new content only after a rebuild (a CMS webhook, the next deploy) or a cache refresh. Before you check a page, check that the deploy that carries your change has finished (the host's deploy status, the pull request's checks), and wait for it; an old build is not a failure. Do not publish content that relies on code not yet deployed in that environment. Tell the person when the change will appear, not only that it is merged.

## 8. Building on the content

- A visible change still gets its design round (`design-directions`) before the build; a direction is drawn with the content the model will hold: real field lengths, the empty and the long case.
- The component handles what editors can do: a missing image, an empty list, a long heading, rich text with links. A field an editor may leave empty is never assumed present.
- **Check it on the page**: the rendered page shows the CMS's content (the draft through the project's preview when it has one), and a change made in the CMS reaches the page the way the project expects (on reload, after a rebuild, or live).
- In the report to the person: which parts of the page their team can now edit in the CMS, and anything waiting for their publish.

## Red flags

| Thought | Reality |
|---|---|
| "I'll hard-code the copy for now; it can move to the CMS later" | Later never comes, and the editors cannot touch it. Model it now. |
| "The CMS's tools aren't installed; I'll just carry on" | Offer them once; without them, warn that you follow the current code and mistakes are more likely. |
| "I know how Sanity works" | Read its official skill for the step. Its rules come first. |
| "The draft looks good; I'll publish it" | Publishing puts it on the live site. Only on the person's yes. |
| "I'll rename this field to something clearer" | Editors' content sits in it. Deprecate, migrate, then remove. |
| "Which dataset? Probably the default one" | Confirm the project and dataset before the first write. |
| "I'll write the content straight to production; it's faster" | Content goes through staging like the code, and reaches production with the release. |
| "Merged and published on staging, so it's live" | When the datasets are separate, the content still has to be moved after the release. Say what, how and when. |
| "The page doesn't show my change; something is broken" | Check the deploy finished and the cache refreshed before you call it a failure. |
| "The content will be there, so the component can assume it" | Production gets the code before the content. Handle its absence. |
| "I'll put the token in the env file and commit it" | Tokens never in the code, a commit, a task or the chat. |
| "A new block, so a new type with the section's name" | Model what the content is; reuse an existing type first. |
| "The page renders, so it's done" | Check it shows the CMS's content and that an editor's change reaches it. |
