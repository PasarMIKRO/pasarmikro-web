# Open roles

Roles on `/career/`. Each role has its own page with the application form; applications, with the CV file, are saved to the Job Applications table in the team's Lark Base.

**Files:** `content/careers/en/<name>.md` and `content/careers/id/<name>.md`, same file name in both languages. The file name is the role's address: `field-officer-lampung.md` becomes `/career/field-officer-lampung/`. When a role is filled, set `open: false` (its page then disappears) instead of deleting the file.

| Field | Required | Rules |
|---|---|---|
| `title` | yes | Job title, max 100 characters. |
| `location` | yes | City or "Remote", max 80 characters: `Jakarta`, `Lampung (field based)`. |
| `employmentType` | yes | Exactly one of `Full-time`, `Part-time`, `Contract`, `Internship`. |
| `open` | no | `false` closes applications and hides the role. Default `true`. |
| `postedAt` | yes | `YYYY-MM-DD`. |

**Description (the body):** use these `##` sections in this order: **About the role**, **What you will do**, **What we are looking for**, and optionally **What we offer**. Lists for duties and requirements. Separate must-haves from nice-to-haves. No salary promises or benefits the company has not approved. Write inclusively: no age, gender, religion or appearance requirements.

## Example

```md
---
title: Field Officer
location: Lampung (field based)
employmentType: Full-time
postedAt: 2026-11-01
---

## About the role

...

## What you will do

- Register farmers and map their plots with the PasarMIKRO app
- ...

## What we are looking for

- ...
```
