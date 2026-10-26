#!/usr/bin/env python3
"""Fail when a skill's frontmatter description is over 1024 characters.

claude.ai stores at most 1024 characters of a description and drops the rest, so a
longer one loses its last trigger phrases there (marketplace sync warnings, 2026-10-26).
Reads `description:` as a single line or a folded block (`>`), with no dependencies, and
fails a one-line value that YAML would cut at an unquoted " #".
"""
import glob
import sys

LIMIT = 1024
# A plain one-line value with " #" is cut there by every YAML parser: the rest is a comment.
COMMENTED = object()


def description(path):
    lines = open(path, encoding="utf-8").read().split("\n")
    if lines[0].strip() != "---":
        return None
    end = lines.index("---", 1)
    front = lines[1:end]
    for i, line in enumerate(front):
        if not line.startswith("description:"):
            continue
        value = line[len("description:"):].strip()
        if value and value[0] not in ">|":
            if value[0] not in "'\"" and " #" in value:
                return COMMENTED
            return value.strip("'\"")
        block = []
        for nxt in front[i + 1:]:
            if nxt and not nxt.startswith(" "):
                break
            block.append(nxt.strip())
        return " ".join(part for part in block if part)
    return None


failed = False
for path in sorted(glob.glob("plugins/*/skills/*/SKILL.md")):
    text = description(path)
    if text is COMMENTED:
        print(f"::error file={path}::description has an unquoted ' #', which YAML reads as a comment; use a folded block (description: >)")
        failed = True
    elif text is None:
        print(f"::error file={path}::no description in the frontmatter")
        failed = True
    elif len(text) > LIMIT:
        print(f"::error file={path}::description is {len(text)} characters; claude.ai keeps {LIMIT}")
        failed = True
sys.exit(1 if failed else 0)
