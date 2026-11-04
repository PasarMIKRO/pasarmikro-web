# Impact figures

Numbers on the homepage and `/impact/`. They stay hidden until files exist. **Only figures confirmed by management, from a source you can point to.** An AI must never produce or estimate these numbers; it may only copy them from the source.

The `/impact/` page is not in the main menu yet. When the first confirmed figures are published, ask a developer to add it (`src/lib/routes.ts`).

## Headline numbers: `content/impact/metrics/<metric>.md`

One file per number, frontmatter only. The file name should match `metric`.

| Field | Required | Rules |
|---|---|---|
| `metric` | yes | One of `farmers`, `total_impact`, `talangin_impact`, `commodities`, `area`. Each at most once. The label next to the number comes from this. |
| `value` | yes | The number as it should appear: `6,700+`, `1.32`, `85`. Max 20 characters. |
| `unit.en` / `unit.id` | no | Shown after the value: `Trillion` / `Triliun`. Leave out for plain counts. |
| `asOf` | yes | `YYYY-MM-DD`, the date the figure was measured. Shown on the page as "Last updated". |
| `source` | yes | Where the number comes from: `Finance dashboard export, 30 June 2026`. Not shown on the site; it is for reviewers. |

```md
---
metric: farmers
value: 6,700+
asOf: 2026-06-30
source: Platform user report, June 2026
---
```

## Trade value per commodity: `content/impact/commodities/<name>.md`

| Field | Required | Rules |
|---|---|---|
| `name.en` / `name.id` | yes | `Eggs` / `Telur`. |
| `tradeValueIdr` | yes | Plain number in rupiah, no dots or commas: `272143000000`. The site formats it. |
| `tonnage` | no | Plain number of tonnes: `22684`. |
| `image` | no | `./images/<file>.jpg`, square. |
| `order` | yes | Whole number; lower shows first. |
| `asOf` / `source` | yes | As above. |

```md
---
name:
  en: Eggs
  id: Telur
tradeValueIdr: 272143000000
tonnage: 22684
order: 1
asOf: 2026-06-30
source: Finance dashboard export, June 2026
---
```
