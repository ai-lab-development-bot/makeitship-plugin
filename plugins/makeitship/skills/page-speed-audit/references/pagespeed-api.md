# Measuring: the PageSpeed Insights and CrUX APIs

Two numbers, and they answer different questions. Keep them apart in every report.

| | Lab: PageSpeed Insights | Field: Chrome UX Report (CrUX) |
|---|---|---|
| What it is | One Lighthouse run on Google's servers — no GPU, throttled CPU and network | What real Chrome visitors experienced, the 75th percentile over the last 28 days |
| Answers | "What slows this page down, and did my fix help?" — today, on demand | "Is the site fast for the people who use it?" |
| Used by Google Search | No | Yes — Core Web Vitals (LCP, INP, CLS) |
| Moves after a fix | Immediately | Over the following 28 days |
| Script | `scripts/psi.cjs` | `scripts/crux.cjs` |

A lab score of 99 does not mean the site is fast for everyone: a heavy element that declines to
start on a GPU-less server (see `heavy-elements.md`) still runs for every visitor who has a GPU.
Say that next to any lab result where it applies.

## Why a key, and how the person gets one

Both APIs belong to Google Cloud. PageSpeed answers without a key, but on a small quota shared
by every caller without one, so runs fail with `429 Quota exceeded` within a few calls — too few
for a baseline of three runs per form factor, let alone before/after pairs. With a key the quota
is the person's own (in the order of 25,000 calls a day). CrUX requires a key.

Ask once, in product words, with the reason, and walk them through it:

> To measure the site as often as the work needs — several runs before and after every change —
> I need a free Google API key; without one, Google cuts the measurements off after a few runs.
> It takes about two minutes:
> 1. Open https://console.cloud.google.com/ and sign in with any Google account; create a
>    project if it asks (any name).
> 2. Open **APIs & Services → Library**, find **PageSpeed Insights API**, press **Enable**; do
>    the same for **Chrome UX Report API**.
> 3. Open **APIs & Services → Credentials → Create credentials → API key** and copy the key.
> 4. Optional but better: on that key, **Restrict key → API restrictions** to the two APIs above.
> Paste the key here; I keep it in a local file that never goes into the code or a commit.

Without a key, still measure what the shared quota allows and say the numbers are thin; do not
block the work on it.

## Keeping the key

- Never in code, a commit, a task, a doc, or a chat summary. Never print it.
- In a project: `.psi-api-key` at the project root, and `.psi-api-key` added to `.gitignore` in
  the same step. Without a project: `~/.config/page-speed-audit/api-key`.
- The scripts read, in order: `--key-file <path>`, `PSI_API_KEY`, `./.psi-api-key`,
  `~/.config/page-speed-audit/api-key`.

## Running PageSpeed

```
node scripts/psi.cjs <public url> [--strategy mobile|desktop|both] [--runs 3] [--raw <file>]
```

- The URL must be reachable from the internet: production, a preview deployment, or a tunnel to
  a local build. Choose the one the project already has; a fix is measured on the same kind of
  URL as its baseline.
- Mobile and desktop both; mobile is the stricter and usually the one that matters.
- **Median of three runs.** A single run swings by several points; `scoreSpread` shows by how
  much. Differences inside the spread are noise.
- `failing` lists the audits that fail, sorted by what they would save (`savings`, in ms of the
  metric named, or CLS). `lcpElement` is the element whose paint is the LCP — usually the first
  thing to look at.
- `--raw` keeps the full Lighthouse result, for the main-thread breakdown by script
  (`bootup-time`, `mainthread-work-breakdown`) and the request chain (`network-requests`).

## Running CrUX

```
node scripts/crux.cjs <url> [--origin]
```

The page and its origin, for phones and desktops: p75 of LCP, INP, CLS, FCP and TTFB, and the
share of good / needs improvement / poor visits. A page with too few visits has no record — the
origin usually does. Thresholds for "good" at p75: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1.

## When the page is not public

Local Lighthouse is the fallback, never the reference: `npx lighthouse <url>
--only-categories=performance --output=json --output-path=<file>`, three runs, then
`node scripts/psi.cjs --lighthouse <file> [<file> …]` for the same summary. A local machine has a
GPU and a different CPU, so it does not reproduce what PageSpeed sees — above all for heavy
elements gated on the GPU. To approximate a GPU-less server, add
`--chrome-flags="--use-angle=swiftshader --enable-unsafe-swiftshader"` and confirm in the page
that the renderer reports SwiftShader. The before/after that counts is measured on a public URL.
