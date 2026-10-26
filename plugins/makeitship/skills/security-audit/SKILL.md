---
name: security-audit
description: >
  Security guidance and vulnerability review for codebases, APIs, services, CLI tools, libraries,
  and daemons — for the whole project, or for one task: "is #12 safe?", "security-check this
  task's change", "audit this pull request". Use for security questions, focused reviews,
  vulnerability research, security audits, or pen tests. Runs the complete workflow (isolated
  hunters, independent verifiers, validated records) only for an explicit audit or pen-test of a
  codebase, a task's change or a pull request, a full review, or requested report artifacts;
  then brings the person what was found in product words, fixes it on request through a fresh
  agent, or hands it on as tasks. Needs the source; never probes a live site.
---

# Security Audit

Find vulnerabilities that violate a real trust boundary, then give owners the source evidence, safe reproduction, priority, and smallest effective fix. This is a defensive, source-first workflow. A candidate without a concrete affected principal, resource, or security outcome is not a confirmed finding.

## Who you are working for

The person is most likely the product owner, not an engineer. They know who uses the product, whose data it holds and what must never happen; they do not know what a trust boundary, an IDOR or a coverage ledger is, and they should never have to.

- **The audit is yours.** Mode, scope, which agents run, what each checks, what counts as confirmed: you decide, and you do not ask. The method below is the expertise; follow it as written.
- **Two things are theirs.** The cost of a full run, because it spends their money (*Cost budget*); and what happens to what was found — fix it now or hand it on (*After the report*).
- **Findings in their words.** Not "high: IDOR in `GET /api/orders/:id`" but "anyone signed in can open any other customer's order by changing the number in the address — high: it exposes other customers' data". The severity anchors below stay; say each as its consequence. The run files, paths and fingerprints are for whoever builds the fix.
- **Facts only they hold are asked once, in product words, with the reason**: which pull request or branch carries a task's change when nothing says so, who is meant to see what when the code cannot tell, how the product is hosted when a lead depends on it. One message, not a drip.

## Operating modes

This skill is guidance by default. Loading it does not authorize the complete audit workflow or file creation.

- **Guidance mode**: For security questions, focused reviews, methodology, triage, or investigation of specific findings, use only the relevant parts of this skill. Do not automatically run all six phases, create an output directory, or write audit artifacts. You may launch focused agents when useful; they return results to the current work.
- **Full audit mode**: Use the complete workflow when the user explicitly asks to audit or pen-test a codebase, a task's change or a pull request, asks for a full, comprehensive, or end-to-end security review, or requests report artifacts. Run all six phases and write the files defined below.

If the request could mean either mode, decide it yourself: a request to audit, check or pen-test code — the project, a task's change, a pull request — is full audit mode; a question about security, or about one piece of code the person points at, is guidance mode. Say in one line which one you are running and why.

## Scope: one task or the whole project

**A task is in the conversation** (a Makeitship task by number, a task they describe, a pull request or branch): the audit is scoped to that task's change, not the project.

- With the makeitship server connected, read the task as the `track-tasks` skill in this plugin does (`get_task`): its description, its comments, and its links — the pull request or branch it carries. (Tools, as the plugin exposes them: `mcp__plugin_makeitship_makeitship__get_task`, `…__add_task_comment`, `…__add_task_relation`.) Without the server, take the change from the conversation or the branch they name; ask once when nothing says which.
- **The change is done** (a pull request, a branch, commits): this is a **scoped run** (*Run profiles and scope*) over the diff between the change and its base branch. Seed units for what the diff adds or changes **and for the trust boundaries it touches** — the callers of changed code, the authorization and isolation it relies on, the data it reads or writes. A flaw is often not in the new lines but in how they meet the old ones. The default profile is `quick`, proposed with its cost like any run. The report presents itself as a review of this change, not of the project.
- **The change is not built yet**: there is nothing to audit. Use guidance mode on the task itself: which boundaries it will touch (whose data, who may do what), and the security conditions its definition of done should carry. Offer to add them to the task (`add_task_comment`, or the task's text through `create-task` for a task not yet on the board).

**No task, or they ask for the project**: the whole repository, as below.

**No source** (only the site's address): this skill needs the code and never probes a deployed site. Say so in one line, and offer a task for whoever has the code.

## Platform terminology

This skill is agent-neutral:

- **Parent** is the agent that coordinates the run and owns shared state.
- **Delegation tool** is the platform's delegation or sub-agent mechanism. (A **task** in this skill is a Makeitship board task, never the delegation tool.)
- **`research` agent** is a delegated agent for focused source exploration and factual verification.
- **`general` agent** is a delegated agent for broad investigation and bounded local execution.
- **`subagent_type:`** in a heading names which of these two delegated agent roles runs that work.

Use equivalent platform capabilities while preserving role, write-isolation, prompt, and independence boundaries.

## Universal execution safety

These rules apply in both operating modes. Source inspection is read-only. Run target-controlled builds, tests, processes, browsers, emulators, fuzzers, and fixture processing only inside an OS-enforced sandbox that provides all of these controls:

- no external network; use only an isolated loopback namespace when the check needs local client/server traffic;
- an empty environment populated from an explicit allowlist with safe values, with scratch-local `HOME`, temporary directories, and caches;
- a read-only target and toolchain, with the target-controlled process able to write only inside its assigned `scratch/` directory; and
- explicit low CPU, memory, process, file-size, disk, and wall-clock limits.

The agent, outside the target-controlled process, may make a disposable source copy in an assigned `scratch/` directory when a build must write beside source. In guidance mode, do not retain target-controlled files. In full audit mode, only trusted parent-side code may promote the minimum non-secret result to retained `artifacts/` using the procedure under Write isolation. Never expose a retained output directory (other than the agent's own assigned `scratch/`), another agent's directory, the host home directory, credentials, sockets, or shared services to target code. Do not install dependencies or let builds fetch them. Use only tools and dependencies already available locally. If every control cannot be enforced, do not execute target code: report the missing sandbox capability as a needs-validation blocker and give a safe validation plan.

Use dummy principals, fixtures, and secrets. Do not probe deployed endpoints, external services, shared infrastructure, production identities, other users' data, or live control planes. Do not test availability against a live or shared process, publish artifacts, alter releases, spend paid API quota, or continue beyond the minimum local effect needed to establish a defect. If the decisive fact is outside source or the sandboxed fixture, report it as needing validation.

## Full audit setup

In full audit mode, resolve these values before reconnaissance:

- **Skill directory**: the absolute directory containing this `SKILL.md`.
- **Target**: the absolute repository root under review.
- **Repo name**: a stable repository identifier from the directory or local Git remote.
- **Output directory**: a new writable directory outside the target, defaulting to `~/security-audit-skill/<repo-name>/run-<N>`, where `<N>` is the next unused integer. Use a directory inside the target only when the user explicitly selects it and the parent verifies that version control ignores the whole directory. Otherwise stop and request an external path.
- **Source ref**: the reviewed commit and whether the worktree is dirty. Do not treat unreviewed generated or modified files as another revision.

### Write isolation

The parent creates and is the only writer of shared run files:

- `run-metadata.json`
- `architecture.md`
- `coverage-ledger.json`
- `findings.json`
- `REPORT.md`
- `FINDINGS-DETAIL.md`
- `NEEDS-VALIDATION.md`

Each hunter or verifier receives a unique root under `<output-dir>/agents/<agent-id>/`, with separate `scratch/` and `artifacts/` directories. Canonical agent IDs match `^[a-z0-9][a-z0-9_-]{0,63}$` and must not equal a Windows device name such as `con`, `prn`, `aux`, `nul`, `com1` through `com9`, or `lpt1` through `lpt9`. Lowercase IDs prevent case-fold collisions. The agent and every target-controlled process may write only to `scratch/`; retained `artifacts/` is parent-owned, is never exposed to the sandbox, and is writable only by trusted parent-side promotion code. Agents may not change shared files, target source, retained artifacts, or another agent's directory. Do not use `/tmp` or the host home directory as a writable fallback.

Before execution, the parent opens and retains trusted, non-inheritable directory descriptors for the agent's `scratch/` and `artifacts/` roots, and records an allowlist of expected scratch-relative artifact files plus explicit per-file and cumulative byte limits. Never pass those descriptors to the agent or sandbox. After the sandbox and all its processes terminate, trusted parent-side code promotes each allowlisted file separately:

1. Validate the declared relative path: reject absolute, empty, `.`, `..`, or symlinked components.
2. Walk each parent component from the retained scratch-root descriptor with no-follow directory-relative operations; never reopen by path.
3. Open the leaf no-follow and nonblocking.
4. Verify with `fstat` that it is a regular file with link count exactly one and within the recorded per-file and cumulative byte limits.
5. Enforce those limits again while reading from that descriptor.
6. Copy exactly the verified size, repeat `fstat`, and reject a changed identity, type, link count, or size.
7. For the destination, walk every parent component from the retained artifacts-root descriptor with no-follow directory-relative operations; require each existing component to be a real directory, and create any missing directory exclusively before reopening and verifying it no-follow.
8. Create the leaf exclusively without following links, verify that the opened destination is a regular file with link count exactly one, and copy from the verified source descriptor without reopening either path.
9. Use equivalent race-safe APIs on non-POSIX systems.
10. Never recursively copy or glob scratch, extract an archive into artifacts, or open or promote a symlink, FIFO, socket, device, directory, hard-linked file, changing file, or file that exceeds its bound.
11. If any check is unavailable, cannot be enforced, or fails, discard the scratch entry; if it is decisive evidence, retain `needs_validation` with the exact promotion blocker.

[HUNTING.md](HUNTING.md) and [VALIDATION-AND-REPORTING.md](VALIDATION-AND-REPORTING.md) carry this procedure as one identical fenced block for hunter and verifier prompts; it states the same rules in the same order as this list.

For a reproduced check, record the command, exact test input, sandbox limits, and only the allowlisted environment variable names plus safe non-secret values needed to reproduce it. Never capture or copy the ambient environment, inherited variables, credential values, authentication state, or unrelated host paths. Launch from an empty environment rather than trying to redact one after execution.

Before delegation, the parent writes `run-metadata.json` with at least `run_id`, `repo`, `target`, `source_ref`, `profile`, `scope_paths`, `budget` (null if unset), `execution_policy: "sandboxed-source-and-local-only"`, selected companion files, prior-run paths, shared-file owners, and `run_status: "in_progress"`. Update metadata only when those facts change; candidate state belongs in the coverage ledger and `findings.json`.

## Full audit planning

The coverage, prior-run, profile, and budget requirements in this section apply only in full audit mode.

### Coverage and prior runs

No one pass is complete. Build a deterministic coverage plan before hunting and update it after every agent result. [RECONNAISSANCE.md](RECONNAISSANCE.md) defines the stable coverage units and [HUNTING.md](HUNTING.md) defines coverage-critic waves. The parent alone updates the ledger.

If prior runs exist, read every compatible `coverage-ledger.json` and `findings.json` before planning the current run:

1. Compare the relevant current source with each prior record and unit. A prior source ref alone is not evidence that a path is unchanged.
2. Carry a prior `confirmed` record into the current candidate set only when its relevant source and conditions are unchanged and its evidence still meets the current contract. Link it to a current ledger unit seeded `planned`, preserve its fingerprint, exclude only that carried root cause from hunters, and send the carried record through the current final verification path; the Phase 3 verifier that re-checks it becomes that unit's assignment owner and moves it to `candidate`.
3. When relevant source for a prior `confirmed` record changed, create a current planned revalidation unit. Do not put that record on the hunter exclusion list. It remains confirmed only if current independent validation establishes the current path and result.
4. Make prior `needs_validation`, `deferred`, `blocked`, `out_of_scope`, and any changed-source unit current work. A still-external `needs_validation` record may be carried only after the current source trace is checked and linked by fingerprint to a current `planned` unit whose verifier re-check supplies its owner and evidence; the record keeps the unresolved blocker. These prior states never suppress a current unit.
5. A prior same-source covered unit may inform priority, but it remains visible in the current ledger. A prior `rejected` record suppresses only the unchanged failed claim, not coverage of its unit; changed evidence creates current work.
6. Read the prior profile and scope. A prior `quick` or scoped ledger contributes only its recorded evidence and gaps, never an implied "rest is fine."

If no prior ledger exists, say so in the final coverage statement. Never imply that one run exhausts the target.

### Run profiles and scope

During full audit setup, pick a profile from the user's request or propose one from the target's size and stakes. Record it in `run-metadata.json` (`profile`, `scope_paths`) and state it in the report. The default is `standard`; for one task's change, `quick`.

- **`quick`** — a bounded pass for small targets, re-runs, or a fast first look. Coarsen ledger units to surface × boundary × attack class (subsystem uses the fixed canonical `profile/quick/all-in-scope-subsystems` identifier), run exactly one hunter wave followed by exactly one final coverage-critic pass, and use one fresh verifier per candidate for both candidate validation and final record verification. Do not launch a follow-up hunter wave: record the critic's accepted discoveries and reassignments as `deferred`.
- **`standard`** — the workflow as written.
- **`deep`** — for high-stakes or large targets. Split ledger units per subsystem and lifecycle mode, run critic waves to a clean pass, keep candidate validation and final record verification as separate fresh agents, and give `prior_covered_same_source` units an independent second pass.

A **scoped run** audits a subset: named paths, one subsystem, one companion domain, or the diff between two source refs. Seed ledger units only for in-scope surfaces and record everything else as `out_of_scope` — never as `covered`. A scoped or `quick` run must present itself as partial coverage.

Profiles change breadth and redundancy, never the evidence bar. Do not scale away the candidate gate, the source/local execution boundary, `needs_validation` discipline, schema validation, or independent verification of `confirmed` records.

#### Cost budget

The ledger makes spend countable: one unit is roughly one hunter assignment, and one surviving candidate is one or two verifier assignments depending on profile. When the user sets a budget — or the parent proposes one for a large target — record `budget` in `run-metadata.json` as a maximum number of agent invocations across all phases.

**Say the cost before the run, in their words.** Before reconnaissance, tell the person the profile you propose, why, and roughly how many separate agents it will run (from the expected units and candidates), next to the cheaper or deeper alternative and what it trades: "a standard check: about 35–45 separate agents, each roughly the size of one small task — a noticeable share of a subscription's limits for a few hours, and clearly more than an ordinary task on pay-per-use; a quick check is about 12 agents and finds less. I recommend the standard one because…". Name a sum of money only when you know both the model's price and that they pay per use, and then only as a range; never invent a precise figure. Their answer — a profile, a scope, a budget — is recorded as above. A fix run after the report (*After the report*) is counted and said the same way.

Apply the strict budget gate before launching any reconnaissance agent. Reserve the four baseline reconnaissance calls, one final post-wave critic for `quick` or one post-wave plus one distinct final-clean critic for `standard`/`deep`, and at least one verifier call. Add focused reconnaissance only after repeating this gate for each extra call. If the requested budget cannot fund that minimum, launch no agent: ask for a larger budget, narrower scope, or different profile. If the request remains unchanged, set `run_status: "incomplete"` with `incomplete_reason: "budget_cannot_fund_reconnaissance_and_reserves"` and report that no audit pass ran.

Spend it in this order:

1. Count reconnaissance, every post-wave critic, and the separate final-clean critic as agent invocations.
2. **Reserve critics and validation before hunting.** For `quick`, reserve its one post-wave final critic. Before every `standard` or `deep` hunter wave, reserve one immediate post-wave critic plus one distinct final-clean critic. Also reserve verifier cost from the profile (about 1 or 2 agents per expected candidate; when in doubt reserve 30% of the balance after critic reservation). Never assign hunters into either reserve.
3. Assign hunters to units in priority order until the hunting allowance is spent. Spend the reserved post-wave critic immediately after that wave; keep the final-clean and validation reserves intact.
4. Before a later wave, reserve its new post-wave critic again. If the remaining budget cannot cover the required critic calls and validation reserve, launch no hunters from that wave, mark its planned units `deferred` with reason `budget_cannot_reserve_critics_and_validation`, and use the retained final-clean critic to record the resulting gap.

Before wave 1, update the pre-recon estimate with seeded units, implied hunter count, mandatory critic calls, validation reserve, and whether the remaining budget covers the plan. If it clearly cannot, say so and propose either a tighter scope or a coarser profile instead of silently thinning evidence. If later facts consume the required final-critic reserve, launch no hunters, mark all planned work deferred, set the run incomplete with reason `critic_budget_exhausted`, and make no complete-coverage claim.

A strict total-agent budget can still be exceeded by an unexpectedly large candidate set or by a material Phase 5 replacement that needs another independent verifier. If the remaining budget cannot validate every candidate, stop hunting, validate candidates in fingerprint order while the budget permits, and set `run_status: "incomplete"` plus `incomplete_reason: "validation_budget_exhausted"`. Keep each unvalidated fingerprint linked to a `candidate` ledger unit with that unresolved reason. Do not put an unvalidated candidate in `findings.json`, relabel it `needs_validation`, or report the run as complete. Phase 6 may produce a partial report only if its first section states that candidate validation is incomplete and lists the affected fingerprints and units. Never exceed a user-set strict budget silently.

## Core principles

### Require a boundary and result

For every candidate, name the lower-trust principal, accepted input or action, intended control, crossed boundary, affected principal or resource, and concrete observed or owner-observable result. Do not elevate a missing best practice, guessed deployment behavior, generic parser crash, or self-impact into a security finding.

### Use bounded local evidence

Static analysis establishes the source path. Sandboxed local tests resolve behavior when all execution controls are available: a minimal function harness, existing unit test, small parser fixture, dummy-tenant integration test, locally rendered configuration, or bounded isolated-loopback client. Stop at a wrong return value, unauthorized dummy record, sanitizer finding, policy difference, or other minimum effect. Do not extend the local check beyond the minimum boundary result or produce persistence, post-fault, or concealment material.

### Respect source visibility

Deployment controls, proxy behavior, provider settings, browser headers, identity policy, broker ACLs, packaging, and topology are real controls. If they are required and absent from the repository, do not assume either presence or absence. Use `needs_validation` with the exact missing fact and a safe owner-observed or local plan.

### Separate priority from certainty

Only `confirmed` records receive severity. Likelihood and impact must reflect the demonstrated conditions and result; overall severity cannot exceed demonstrated impact. `needs_validation` means a specific source-grounded boundary hypothesis is blocked, not a low-confidence confirmed vulnerability, and it has no severity.

Calibrate overall severity with these anchors:

- **critical** — an unauthenticated actor gains code execution, full data-store access, or takeover of arbitrary accounts.
- **high** — an actor fully defeats an explicit security control with real consequences: authentication bypass, cross-tenant read or write, stored script execution affecting other users, authenticated code execution, or an unauthenticated remote stop of a shared service.
- **medium** — a real boundary violation with limited blast radius, uncommon preconditions, or consequences confined to a narrow resource set.
- **low** — disclosure of non-secret internals, or an effect requiring sustained effort for minimal gain.
- **informational** — a confirmed but minimal-impact observation, useful mainly as a prerequisite inside a larger finding.

The high/medium discriminator: does the demonstrated result fully defeat an explicit control for an action with real consequences, or only weaken it? If you cannot state the concrete damage, the severity is lower than it feels.

### Recommend the smallest effective source fix

For each confirmed finding, identify the invariant the code must enforce and the narrowest source change that enforces it at the last trusted decision point. Prefer specific repository-relative changes and regression tests over generic hardening advice. The audit describes fixes; it does not modify target source. Fixing comes after the run, only on the person's choice (*After the report*).

## Full audit workflow

In full audit mode, follow all six phases in order:

1. **Reconnaissance** — map the source, trust boundaries, local build paths, companion selections, prior evidence, and initial deterministic coverage ledger with [RECONNAISSANCE.md](RECONNAISSANCE.md).
2. **Coverage-led hunting waves** — assign isolated hunters from the ledger and collect structured candidate results with [HUNTING.md](HUNTING.md), [ATTACK-CLASSES.md](ATTACK-CLASSES.md), and the selected domain companions.
3. **Candidate validation** — consolidate fingerprints and give every candidate to a fresh source verifier as defined in [VALIDATION-AND-REPORTING.md](VALIDATION-AND-REPORTING.md).
4. **Structured output** — write all final `confirmed`, `needs_validation`, and `rejected` records to `findings.json`; validate it with `report-schema.json` and `validate-findings.cjs`, and validate the coverage claim with `validate-coverage-ledger.cjs`.
5. **Independent record verification** — use fresh agents to verify final source claims and reconcile corrections or state changes.
6. **Target-neutral report** — derive `REPORT.md`, `FINDINGS-DETAIL.md`, and `NEEDS-VALIDATION.md` from the final records, with no live-probe instructions.

Do not end the run before one of exactly two terminal states: (a) all Phase 6 artifacts are written and both validators pass, or (b) `run_status: "incomplete"` is recorded with its exact reason and the gap is disclosed in the report. Never stop mid-phase.

## After the report

The Phase 6 files stay where they are, for whoever builds the fixes. The person gets the result in the chat, in their words:

1. **What was checked**: the project or this task's change, the profile, and that one run never covers everything (a scoped or `quick` run says it is partial).
2. **What was found**, most serious first: for each `confirmed` record, what someone could do, to whose data or account, and how serious that is — the severity as its consequence. When nothing was confirmed, say so in one line, with what was checked.
3. **What could not be settled** (`needs_validation`): verify everything you can yourself first. Of what remains, ask the person once, in product words, for the facts only they hold (how the product is hosted, who is meant to see what); for the rest — a fact an engineer must look at — offer a task for an engineer, one per open question, with the exact question and the safe check from the record's validation plan.

Then **one message, two ways forward** for the confirmed findings, with a **Recommended** one and its reason:

- **Fix now.** One fresh agent per root cause, given only the record (trace, invariant, recommended fix) and the code — not the hunt — and run one after another, never in parallel: fixes to the same authorization or middleware code would collide. Each fixer makes the narrowest change that enforces the invariant at the last trusted decision point and adds the regression test that fails before the fix and passes after. Then another fresh agent, one that neither found nor fixed it, checks the fix: the boundary now holds on every path the record traced, trust was not merely moved, and the test pins it. The parent commits each verified fix as its own change. Say the number of agents first, as in *Cost budget*. Where the platform has no delegation, fix in the parent, and keep the independent check wherever it can run. A fix that would change what users can see or do (someone loses access they had, a flow gains a step) is said in product words before it is made. Commit, push and release only as the project and the person allow.
- **Hand it on as tasks.** One task per root cause, written for whoever has the code: what someone could do, where, how serious, the fix the record recommends and what users would notice after it. Use the `create-task` skill in this plugin.

**Tasks** — for findings or for open questions — never carry secrets, credentials or tokens, and describe what to check and fix, not a step-by-step way to exploit it. When the audit was of a task, each new task is linked to it as `related` (`add_task_relation`, as `track-tasks` does), and the task gets one comment with the summary above. Without the makeitship server connected, give the person the task texts and the summary instead.

## Anti-patterns

1. Checklist deviations presented as vulnerabilities.
2. Defense-in-depth advice with no reachable boundary violation.
3. Live or shared-environment testing where bounded local evidence is insufficient.
4. Guessing provider, proxy, browser, identity, or deployment behavior not present in source.
5. Treating intended same-principal authority or self-impact as a cross-boundary result.
6. Reporting a parser or runtime effect stronger than the observed effect.
7. Emitting prose-only hunter results that cannot be deduplicated or verified.
8. Re-reporting carried same-source prior confirmed records or using them as exemplars that anchor the hunt.
9. Assigning severity to `needs_validation` records.
10. Writing the report before independent verification or letting prose and JSON disagree.
11. Asking the person which mode, which scope or which agents — anything but the cost and what to do with the findings.
12. Starting a full run before the person has heard its cost.
13. "High: IDOR in the orders endpoint" in the chat instead of what someone could do and to whom.
14. Auditing the whole project when the request was about one task's change, or only the diff lines and not the boundaries they touch.
15. A fixer that also hunted or validated the same finding, fixers running in parallel on shared code, or a fix nobody independent checked.
16. Exploit steps, secrets or tokens in a task or a comment.
