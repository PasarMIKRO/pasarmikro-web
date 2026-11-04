# Hero slides

The slider at the top of the homepage. Each file is one slide; both languages are in the same file. Keep 2 to 5 active slides: more than that and nobody sees the last ones.

**Files:** `content/slides/<name>.md`, photos in `content/slides/images/`. The file has frontmatter only, no body text.

| Field | Required | Rules |
|---|---|---|
| `order` | yes | Whole number. Lower shows first (1, 2, 3). |
| `active` | no | `false` hides the slide. Default `true`. |
| `title.en` / `title.id` | yes | The headline. Max 90 characters. One idea, no full stop needed. |
| `highlight.en` / `highlight.id` | no | Short phrase in the yellow label under the headline. Max 40 characters, 2 to 6 words. Adds something the headline does not say. |
| `body.en` / `body.id` | yes | One or two sentences, max 220 characters. What the reader gets. |
| `cta.label.en` / `cta.label.id` | no | Button text, max 30 characters. Says what happens: "See the EUDR program", not "Learn more". |
| `cta.href` | with `cta` | A site path like `/eudr/` (the Indonesian page is linked automatically) or a full `https://` link. |
| `image` | yes | `./images/<file>.jpg`. Landscape, at least 1600 px wide, subject on the right half (text sits on the left). |
| `imageAlt.en` / `imageAlt.id` | yes | What the photo shows. |

**Good slide:** one clear message, a fact the reader cares about, one action. Do not repeat the same message as another slide.

## Example

```md
---
order: 1
title:
  en: Keep selling Indonesian coffee and cocoa to Europe
  id: Tetap ekspor kopi dan kakao Indonesia ke Eropa
highlight:
  en: EUDR ready, plot by plot
  id: Siap EUDR, kebun demi kebun
body:
  en: We map farm plots, keep the compliance evidence and link it to every lot you buy, ahead of the 30 December 2026 deadline.
  id: Kami memetakan kebun, menyimpan bukti kepatuhan, dan menghubungkannya ke setiap lot yang Anda beli, sebelum tenggat 30 Desember 2026.
cta:
  label:
    en: See the EUDR program
    id: Lihat program EUDR
  href: /eudr/
image: ./images/coffee-harvest.jpg
imageAlt:
  en: A smallholder farmer picking ripe coffee cherries
  id: Petani kecil memetik buah kopi yang matang
---
```
