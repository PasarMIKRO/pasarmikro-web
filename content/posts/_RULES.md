# Posts: case studies, insights and platform news

Articles. `type` decides where a post appears:

| `type` | Shows on | Use it for |
|---|---|---|
| `case-study` | `/case-studies/` and the homepage | Real work with a named partner, cooperative, region or commodity, and what changed. |
| `insight` | `/insights/` | Explaining a topic buyers and traders care about (EUDR, trade finance, a commodity market). |
| `news` | `/insights/` (Platform news) | Product releases, partnerships, events, awards. |

**Files:** `content/posts/en/<name>.md` and `content/posts/id/<name>.md`, photos in `content/posts/images/`. Same file name in both languages. The file name becomes the address: `/case-studies/<name>/` or `/insights/<name>/`.

## Frontmatter

| Field | Required | Rules |
|---|---|---|
| `type` | yes | `case-study`, `insight` or `news`. |
| `title` | yes | Max 120 characters. Specific: who, where, what. "Ngawi: Indonesia’s rice powerhouse, facing real challenges", not "A success story". |
| `excerpt` | yes | One or two sentences, max 300 characters. Shown on cards, in search results and at the top of the article. |
| `publishedAt` | yes | `YYYY-MM-DD`. Newest shows first. |
| `author` | no | Person or team name. Default `PasarMIKRO`. |
| `tags` | no | Up to 8 short tags: `[EUDR, Coffee, Lampung]`. |
| `cover` | no | `../images/<file>.jpg`, landscape, at least 1600 px wide. |
| `coverAlt` | with `cover` | What the photo shows. |
| `draft` | no | `true` keeps it off the site. |

## Body (the article)

- Markdown after the frontmatter. Use `##` for section headings (never `#`; the title is already the page heading).
- Case studies follow this order, each as a `##` section: **The challenge**, **What we did**, **Results**, and optionally **What is next**. Results only with real, checked numbers.
- 400 to 1200 words. Short paragraphs (2 to 4 sentences). Lists for steps or features.
- Links: site pages as `/eudr/`, outside sites as full `https://` links.
- Quote people only with their real words and permission, and name them with their role.
- No images inside the body for now; use `cover`.

## Example

```md
---
type: case-study
title: "Ngawi: Indonesia’s rice powerhouse, facing real challenges"
excerpt: <one or two sentences from the source material about what this case is and why it matters>
publishedAt: 2025-08-15
tags: [Rice, Ngawi, East Java]
cover: ../images/ngawi-rice.jpg
coverAlt: Rice fields in Ngawi, East Java, before harvest
---

## The challenge

<from the source material only> ...

## What we did

...

## Results

...
```
