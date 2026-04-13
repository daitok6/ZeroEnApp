---
name: content
description: Review today's build log and draft social media posts via the content-capture agent. No arguments needed — run at end of a work session.
---

# /content

Review today's build log and draft social media posts.

## What this does
Triggers the `content-capture` agent to:
1. Read `HQ/marketing/content-log.md`
2. Identify the content-worthy moments from this session
3. Draft X posts, Instagram captions, and newsletter blurbs

## Usage
```
/content
```

No arguments needed. Run at the end of a work session.

## Output
Drafted posts in the terminal for operator review. Nothing is posted automatically — you decide what goes out.

## Agent
`HQ/agents/content-capture.md`
