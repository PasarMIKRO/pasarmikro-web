# Impact figures

Numbers on the homepage and `/impact/`. They stay hidden until files exist. **Only figures confirmed by management, from a source you can point to.** An AI must never produce or estimate these numbers; it may only copy them from the source.

The `/impact/` page is in the main menu. Until metric files exist it shows "The impact figures are being updated."

## Headline numbers: `content/impact/metrics/<metric>.md`

One file per number, frontmatter only. The file name is `metric` with hyphens: `total-impact.md`.

| Field | Required | Rules |
|---|---|---|
| `metric` | yes | One of `farmers`, `total_impact`, `talangin_impact`, `commodities`, `area`, `women`. Each at most once. The label next to the number comes from this. |
| `value` | yes | The number as it should appear: `6,700+`, `1.32`, `63%`. Max 20 characters. For money (`total_impact`, `talangin_impact`) give `value.en` in USD and `value.id` in rupiah, each copied from the matching USD / IDR tab of the source. Never convert currencies yourself. |
| `unit.en` / `unit.id` | no | Shown after the value: `Million USD` / `Triliun`. Leave out for plain counts and percentages. |
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

Money, different per language:

```md
---
metric: total_impact
value:
  en: 80+
  id: 1.3+
unit:
  en: Million USD
  id: Triliun
asOf: 2026-09-30
source: "[SSOT] Investors Report, General (Monthly USD / IDR), Sep 2026"
---
```

### What may be published

Only these, from the SSOT Investors Report: registered businesses, total trade value (cumulative), total Talangin disbursed (cumulative), commodities traded, area reached, the share of women among registered businesses, and per-commodity trade value. Everything else in that report stays internal. That includes revenue, profit, cash, runway, receivables, PAR, write-offs, funders, active-user counts, monthly figures and concentration percentages.

## Commodities traded: `content/impact/commodities/<name>.md`

Shown as names only, most-traded first. Trade value or tonnage per commodity is not published (concentration data stays internal).

| Field | Required | Rules |
|---|---|---|
| `name.en` / `name.id` | yes | `Eggs` / `Telur`. |
| `image` | no | `./images/<file>.jpg`, square. |
| `order` | yes | Whole number; rank by trade value, 1 = most traded. |
| `asOf` / `source` | yes | As above. |

## Growth chart: `content/impact/growth/<year>.md`

One file per bar: registered businesses at that date, usually 31 December. The latest year may use the newest month. The chart label comes from `asOf` ("Dec 2025", "Sep 2026"); the women share and the "up from" line in the teal band are worked out by the site.

| Field | Required | Rules |
|---|---|---|
| `registered` | yes | SSOT "Current #of Registered Business" at `asOf`. Plain number: `7801`. |
| `women` | yes | SSOT "Registered Business (Female)" at `asOf`. Plain number: `4884`. |
| `asOf` / `source` | yes | As above. |

## Where we work: `content/impact/regions/<name>.md`

Province names only, no figures. `name.en` / `name.id` (`East Java` / `Jawa Timur`) and `order` (west to east).
