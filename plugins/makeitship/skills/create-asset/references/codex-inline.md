# Running Codex inline

Read this on route B: you are not Codex, and Codex is on the machine. You operate Codex the way a
person at the terminal would — give it the job, wait, read what it says, decide what next.

The commands below are what the Codex CLI accepts today. Codex changes; confirm them from
`codex --help` and `codex exec --help` before you rely on a flag.

## 1. Is it there and signed in

- **Find a working copy.** Try `codex --version`. When `codex` is not on the path, or the one
  there fails to start (some machines carry a broken copy, built for another processor or missing
  a library), look for another copy before you decide Codex is missing — for example, one bundled
  inside the ChatGPT or Codex desktop app, or inside an editor's Codex extension. Use the first
  that answers, and say which one you used. None answers → route C.
- **Signed in?** `codex login status` says it is logged in → go on. Not logged in → route C
  (signing in needs the person's browser and subscription; it is never yours to do on your own).

## 2. Run it in the foreground

Write the job (§3) to a file, and run one non-interactive Codex session per job, in the
foreground, reading the job from that file:

```
codex exec -s workspace-write -C <folder> --skip-git-repo-check -i <ref1> -i <ref2> -- - < job.txt
```

- **The job goes on standard input, after `--`.** The image option takes any number of files: a
  prompt written after the last `-i` is read as one more image, and Codex then waits for a prompt
  forever. `-- -` ends the image list and tells Codex to read the prompt from standard input;
  with no reference images, drop the `-i` options and keep `-- - < job.txt`.
- **Foreground only.** Never with `&`, a background or detached mode, or a job you start and
  leave: a detached Codex loses the link with you. Give the command the longest timeout your
  shell tool allows; one image usually takes one to a few minutes. If your tool moves a long
  command to the background by itself when its timeout runs out, wait for that run to finish and
  read its output before anything else; never start a second run beside it. A run with no output
  for far longer than usual is stuck: stop it and look at what it printed last.
- **Least privilege.** Let it write only where it must: a sandbox that allows writes in the
  working folder (today `-s workspace-write`) with `<folder>` set to a scratch folder of your
  session; you move the chosen file into place yourself (SKILL.md §5). Never a flag that bypasses
  approvals or the sandbox.

## 3. The job you give it

The job file holds these instructions first, then the brief from `references/prompt.md`:

- use your own image-generation skill;
- copy the final image into the working folder as `<name>`;
- answer with the file's path, its pixel size, and — for a transparent asset — whether the file
  has an alpha channel with transparent pixels.

Codex's own image skill has its own rules about where files go; when its answer names a
different path, take the file from there.

## 4. Read the answer, then decide

- **Judge by the image, not by the log.** Codex may print errors from its own tools or servers
  that have nothing to do with the image. The run succeeded when the image exists and opens.
- Open the image yourself and judge it (SKILL.md §5). Codex's own report is a hint, not the
  check.
- Another take, or a targeted fix → a new run with one change in the job, attaching the previous
  image when it helps. Several distinct assets → one run each.
- A run that fails with no image (a quota, an expired sign-in, a refusal naming its reason) → do
  not loop: tell the person what Codex said and fall back to route C.
