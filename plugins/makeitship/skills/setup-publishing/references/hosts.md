# Hosts: what the setup needs from each

Every line below was taken from the page it links to. Hosts change their menus and their CLIs:
**before you act on a step, open its page and check that it still says this.** When the page and
this file disagree, the page wins — do what it says, and tell the person this skill's guide is out
of date on that point. A line marked *not confirmed* is something the docs do not say; treat it as
a guess to check, never as a fact to tell the person.

Top-level documentation:

- MakeItShip's deploy workflows: https://github.com/ai-lab-development-bot/makeitship-actions (README at the `v1` tag: what the deploy files must keep, the build options)
- GitHub Actions secrets: https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions
- GitHub Apps installed on a repository: https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps
- Vercel: https://vercel.com/docs · CLI: https://vercel.com/docs/cli
- Netlify: https://docs.netlify.com · CLI: https://cli.netlify.com
- Cloudflare Workers: https://developers.cloudflare.com/workers/ · Wrangler: https://developers.cloudflare.com/workers/wrangler/

## Who fixes what

The checklist items the setup works on (`get_publish_readiness`), what each red one means, and who fixes it. An item or a reason not in this table is a hard case: offer the expert.

| Item · reason | Who | How |
|---|---|---|
| `repo_connected` · `not_connected`, `access_lost` | the person | Releases → **Connect GitHub** (again), choose the repository, **Set it up** |
| `staging_branch` · `missing` | the person | Releases → **Restore protection** when the page offers it (it re-applies Set it up's changes); otherwise a hard case |
| `protection` · `not_enforced` (yellow) | nobody | GitHub Free does not enforce it on a private repository; it does not block |
| `protection` · `missing`, `bypass_too_wide` | the person | Releases → **Restore protection** when the page offers it; otherwise a hard case |
| `deploy_files` · `missing`, `wrong_*`, `invalid_file`, `not_shared`, `unsupported_version`, `host_unknown` | you | the deploy files, through a pull request into staging (SKILL.md §4) |
| `deploy_files` · `not_merged` | the person | **Prepare the merge** on Releases, then merge it on GitHub (SKILL.md §8) |
| `host_key` · `missing` | the person | the key from the host into GitHub under the named secret (below) |
| `workflow_permissions` · `read_only_token` | you, then the person | the deploy files must grant `contents: write` to the deploy job as the templates do; if they do, Releases → **Restore protection** when the page offers it, otherwise a hard case |
| `host_autodeploy_off` · `host_access_unchecked` (yellow) | the person | remove the repository from the host's GitHub app, then tick the box (below) |
| `host_autodeploy_off` · `host_deploys_main` | the person | the host put main live by itself: remove the repository from its GitHub app (below), then **Check again**; the tick alone does not clear it |
| `test_deploy` · `failed`, `timed_out` | you | read the staging run's log on GitHub, fix the cause, check again |
| any · `permissions_missing` | the person | approve MakeItShip's app permissions on GitHub (the link on Releases) |
| any · `check_failed` | — | GitHub did not answer; check again later |

## Keys on GitHub

The host's key goes into the repository's secrets, never into an environment. From
https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions:
the repository's **Settings** → **Secrets and variables** → **Actions** → **Secrets** →
**New repository secret** → **Name** and **Secret** → **Add secret**.

Why not an environment: "If you are using GitHub Free, environment secrets are only available in
public repositories" (https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments),
yet GitHub's API accepts one on a private repository with GitHub Free — it is stored and then
ignored when the deploy runs. MakeItShip's check reads repository secrets only.

## Which host

The deploy files name it (`host:` in `deploy-production.yml`); before they exist, read it from the
repository (a convention, not from a doc):

| Host | Files that point to it |
|---|---|
| Vercel | `vercel.json`, `vercel.ts`, `.vercel/project.json` (`.vercel/` is usually not committed) |
| Netlify | `netlify.toml`, `.netlify/state.json` (`.netlify/` is usually not committed) |
| Cloudflare Workers | `wrangler.toml`, `wrangler.json`, `wrangler.jsonc` with `main` or `assets` (with `pages_build_output_dir` it is a Pages project, which the deploy workflows do not support) |

Nothing points anywhere, or two hosts do: ask the person where their code is live today.

## Turning off the host's own deploys

MakeItShip cannot see which GitHub apps reach the repository. The person removes the repository from
the host's GitHub app — for every host the same way — and ticks the box on the Releases checklist
("I checked: <host>'s app doesn't have access to <repo>"); Publish stays off until it is ticked.
Previews are not kept: staging replaces them.

From https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps:

1. In the repository, **Settings** → under **Integrations**, **GitHub Apps** → **Configure** next to the host's app.
2. Under **Repository access**, choose **Only select repositories**, leave this repository out, **Save**.
3. Do not press **Uninstall**: it removes the app from every repository of that account, and the person's other projects may use it.

In an organization, only an organization owner can change an app's repository access (same page).

The host's app names on GitHub: `vercel`, `netlify`, and "Cloudflare Workers and Pages" (one app for
both). *Not confirmed:* whether Netlify's and Cloudflare's apps create GitHub deployments — which is
why the person checks instead of MakeItShip.

The host also keeps its own link to the repository; disconnecting it there is tidy, not required:

- Vercel: **Settings** → **Git** → **Connected Git Repository** → **Disconnect** — https://vercel.com/docs/project-configuration/git-settings
- Netlify: **Project configuration** → **Developer settings** → **Continuous deployment** → **Build settings** → **Configure** → **Build status**: **Stopped builds**; deploys from the CLI still work — https://docs.netlify.com/build/configure-builds/stop-or-activate-builds/
- Cloudflare Workers Builds: **Settings** → **Builds** → **Disconnect** — https://developers.cloudflare.com/workers/ci-cd/builds/

## Vercel

- **The key.** A token from the account's **Tokens** page, saved on GitHub as `VERCEL_TOKEN` — https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel
- **The ids** (`__VERCEL_ORG_ID__`, `__VERCEL_PROJECT_ID__`): `.vercel/project.json` after `vercel link`, or the project's **Settings** → **General** (Project ID) — https://vercel.com/docs/project-configuration/project-settings. The CLI picks the project from `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` without linking — https://vercel.com/docs/cli/global-options
- **How it deploys.** Staging: `vercel pull --environment=preview`, `vercel build`, `vercel deploy --prebuilt`; production with `--prod` — the same commands as the guide above. Staging uses the project's **Preview** settings, production its **Production** settings — https://vercel.com/docs/cli/build
- **The staging address** (`__VERCEL_STAGING_ALIAS__`, in `deploy-staging.yml` and `rollback.yml`): the deploy points this address at each staging deploy with `vercel alias set` — https://vercel.com/docs/cli/alias. A domain the person owns (`staging.example.com`) works once it is added to the project. *Not confirmed:* whether a free `*.vercel.app` name can be used as an alias on every plan; if `alias set` fails, the staging run fails although the deploy itself worked.
- **Who can open staging.** Vercel protects every address except the production domains by default, so staging opens only for people logged in to the Vercel team — https://vercel.com/docs/deployment-protection. Explain both ways in plain words and let the person choose: keep it closed (only their team sees unfinished work) or open it to anyone with the link (easier to show, but anyone the link reaches sees it). Record the choice on the setup task.

## Netlify

- **The key.** **User settings** → **Applications** → **Personal access tokens** → **New access token**, saved on GitHub as `NETLIFY_AUTH_TOKEN` — https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/. A password reset invalidates every token (same page).
- **The id** (`__NETLIFY_SITE_ID__`): **Project configuration** → **General** → **Project details** → **Project ID** (the CLI calls it the site id) — same page.
- **The build output** (`__OUTPUT_DIR__`): the folder the build writes (`dist`, `build`, `out`…); read it from the build tool's config. The deploy runs `netlify deploy --no-build --dir <it> --site <id>` after the build — https://cli.netlify.com/commands/deploy/
- **The staging address.** Staging deploys use `--alias staging` (input `netlify_staging_alias`). The alias must not equal a deployed branch name while the host still builds branches — another reason to turn the host's builds off (CLI page above). *Not confirmed:* the exact address an alias gets; read it from the staging run's log after the first deploy.

## Cloudflare Workers

- **The key.** **Account API tokens** → **Create Token** from the **Edit Cloudflare Workers** template, limited to the one account; saved on GitHub as `CLOUDFLARE_API_TOKEN`, with `CLOUDFLARE_ACCOUNT_ID` beside it — https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- **The account id:** **Workers & Pages** → **Account Details** → **Account ID** — https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/
- **The Worker** (`__WORKER_NAME__`): the `name` in the wrangler config. The deploy publishes `<name>-staging` and `<name>-production` with `wrangler deploy --name` — https://developers.cloudflare.com/workers/wrangler/commands/workers/. *Not confirmed:* that `--name` overrides the config's `name` in every setup (with the Vite plugin it is undocumented).
- **The staging address:** `<name>-staging.<account subdomain>.workers.dev` — https://developers.cloudflare.com/workers/configuration/routing/workers-dev/. *Not confirmed:* whether the account's workers.dev subdomain must be set up before the first deploy.
- **Before you start:** a wrangler config with `routes` or a custom domain would make the staging Worker claim them too — stop and hand the setup to an expert. Secrets and variables belong to one Worker, so `<name>-staging` and `<name>-production` each need their own.
