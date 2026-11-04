# Life at PasarMIKRO

Stories about team events, field visits and company moments, on `/life-at-pasarmikro/`.

**Files:** `content/life/en/<name>.md` and `content/life/id/<name>.md`, same file name in both languages, photos in `content/life/images/`. Copy the same `cover` and `gallery` into both language files.

| Field | Required | Rules |
|---|---|---|
| `name` | yes | Event name, max 100 characters. |
| `date` | yes | `YYYY-MM-DD`, the day it happened. Newest shows first. |
| `cover` | yes | `../images/<file>.jpg`, landscape. |
| `coverAlt` | yes | What the photo shows. |
| `gallery` | no | Up to 24 photos, each with `src` and `alt` (see example). |
| `draft` | no | `true` hides it. |

**Story (the body):** 150 to 600 words. What happened, who took part, why it matters to the team or to farmers. Name colleagues only if they agreed to be named, and only photograph people who agreed to appear.

## Example

```md
---
name: Eco Challenge
date: 2025-04-19
cover: ../images/eco-challenge-cover.jpg
coverAlt: The PasarMIKRO team collecting litter in a park in Jakarta
gallery:
  - src: ../images/eco-challenge-1.jpg
    alt: Team members sorting plastic waste
---

...
```
