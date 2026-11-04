# Testimonials

Customer quotes on the homepage. The section stays hidden until there is at least one.

**Only real quotes from real customers who agreed to be quoted.** Do not let an AI write or "improve" a quote: use the person's own words (you may shorten them, and translate them for the other language). The build rejects a testimonial without `consent: true`.

**Files:** `content/testimonials/<name>.md`, photos in `content/testimonials/images/`. Frontmatter only.

| Field | Required | Rules |
|---|---|---|
| `name` | yes | The person's name as they agreed to be shown. |
| `role.en` / `role.id` | yes | What they do: `Egg farmer, Blitar` / `Peternak ayam, Blitar`. |
| `quote.en` / `quote.id` | yes | Their words, max 400 characters each. No quotation marks: the site adds them. |
| `photo` | no | `./images/<file>.jpg`, square, only with their permission. |
| `order` | yes | Whole number; lower shows first. |
| `consent` | yes | `true`, once the person has agreed. Keep the written agreement on file. |

## Example

```md
---
name: Indriani
role:
  en: Poultry farmer
  id: Peternak ayam
quote:
  en: <their words, translated>
  id: <their own words>
order: 1
consent: true
---
```
