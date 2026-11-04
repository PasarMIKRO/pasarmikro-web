# Team

People on `/team/`, grouped by division. One file per person, both languages in the same file, frontmatter only.

**Files:** `content/team/<first-last>.md`, photos in `content/team/images/`. Only add people who agreed to be listed, with a photo they approved.

| Field | Required | Rules |
|---|---|---|
| `name` | yes | Full name as the person writes it. |
| `role` | yes | Job title in English, as the person uses it: `Chief Executive Officer`. Do not translate it. |
| `division` | yes | Group heading, written the same way for everyone in it: `Founders`, `Operations`, `Technology`. Divisions appear in the order of their lowest `order`. The first division gets large cards, the second medium cards, the rest compact rows, so put the most senior group first. |
| `order` | yes | Whole number; lower shows first. |
| `linkedin` | no | Full `https://www.linkedin.com/in/...` link. |
| `photo` | no | `./images/<file>.jpg`, square, at least 600 px. Without a photo the site shows the person's initials. |
| `active` | no | `false` hides someone who left. |

## Example

```md
---
name: Hugo Verwayen
role: Chief Executive Officer
division: Founders
order: 1
linkedin: https://www.linkedin.com/in/hugo-verwayen
photo: ./images/hugo-verwayen.jpg
---
```
