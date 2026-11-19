# The brief

One brief serves every route: you give it to your own image skill (route A), to Codex inline
(route B), or to the person to copy (route C). Write it from SKILL.md §2–3; leave out a line that
says nothing for this asset.

```
Asset: <what it is and what it must say>
Used in: <the product, the screen or page, the slot>
Size and proportions: <aspect ratio; the displayed size; the size to generate at>
Background: <transparent — a genuinely transparent background with a clean alpha edge, no
  backdrop, no shadow plate> | <its own background: what it is>
Surface: <the colours under it; light and dark theme if the product has both>
Style: <taken from the project: the neighbouring assets, the design tokens — line, shape,
  palette, light, level of detail>
References: <Image 1: what to take from it; Image 2: …> | <the person's reference, as given>
Subject and composition: <the subject, framing, where the empty space is>
Text: <exact text, verbatim> | none
Avoid: <no text, no watermark, no logos; anything the project's style excludes>
```

State the size as proportions plus a target: generators pick their own default frame, which is
rarely the one the slot needs. On route B the instructions for Codex itself come first in the job
file, then this brief (`codex-inline.md` §3).

## Without Codex (route C)

Say it in the conversation's language and in product words, then ask the question from SKILL.md
§4 C. The shape:

> I can't make this image myself here: Codex isn't set up on this machine. I recommend setting
> it up — it makes good images, including ones with a transparent background, and then I'll make
> assets like this one by myself next time, without you:
> 1. Install the Codex CLI (the official instructions: https://learn.chatgpt.com/docs/codex/cli).
> 2. Sign in with your ChatGPT account that has a Codex plan: run `codex login`.
>
> For now, shall I use <the image generator(s) available here>, or give you the full prompt to
> paste into Codex or another generator?

With no other generator, end with the prompt instead of the question. The prompt goes in one
code block, complete and standalone: the brief above, with the references described in words
and named as files to attach, and what to do with the result (format, where it goes).
