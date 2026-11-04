# PasarMIKRO website design direction

Status: revised by the owner on 27 Oct 2026. The first "calmer corporate" version was too plain and did not feel like PasarMIKRO. The site now follows the app's visual language, with Inter as the font and no impact numbers for now.
Sources: the logo files, the PasarMIKRO Android app and its Play Store panels, the LinkedIn company page, the existing EUDR pages.

## Identity

PasarMIKRO digitizes Indonesian smallholder supply chains: trade, Talangin working capital, traceability, ERP and EUDR/ESG compliance. Two audiences:

- **Buyers, exporters, brands, funders** (often in Europe) who need traceable, compliant smallholder supply.
- **Farmers, traders, cooperatives** in Indonesia who use the app. The brand they know is the app.

Personality, as the app expresses it: practical, warm, Indonesian, on the farmer's side ("#MikroHeroes"). Confident and friendly, never corporate-cold.

## Logo

- Mark: interlocking planks forming a roof/mountain shape, drawn as outlines. Yellow on light backgrounds, white on teal.
- Wordmark: "PASAR" regular + "MIKRO" bold, teal on light, white on teal.
- Files: `src/assets/brand/logo.svg`, `src/assets/brand/mark.svg`.

## Palette (from the PasarMIKRO Business app theme, `src/Theme/colors.js`)

| Role | Hex | App token |
|---|---|---|
| Brand teal (core) | `#006386` | primary-400 (also the wordmark) |
| Deep teal (core) | `#005270` / `#004259` / `#003143` | primary-500 / 600 / 700, used for the panel gradient |
| Light teal | `#ECF9FE` / `#C0E5F2` | primary-25 / 50 |
| Yellow (accent) | `#FDB022`, hover `#FEC84B` | warning-400 / 300 (the logo mark itself is `#F2BB3A`) |
| Ink | `#101828` | neutral-900 |
| Muted text | `#475467` | neutral-600 |
| Surface / lines | `#F2F4F7` / `#EAECF0` | neutral-100 / 200 |

Rules:
- Teal gradient panels carry the hero, page headers and one feature band per page.
- Yellow is the accent: the highlight label under a heading, primary buttons on teal, and the logo mark. Never as text on white.
- Content sits in white rounded cards on the light grey surface, like the app.

## Typography

- **Inter** (owner's choice, and the font of the PasarMIKRO Business app), one variable font.
- Headings bold with tight tracking; white on teal panels.
- No monospace and no wide-tracked uppercase labels.

## Identity motifs

1. **Yellow highlight label**: the app's yellow rounded box holding a short phrase under a heading ("Fiturnya Lengkap", "Kembangkan Bisnismu"). Used on the hero slides, page headers and section headings, one per heading at most.
2. **Teal gradient panel**: the app store panel background, deep at the edges and brighter teal toward the centre.
3. **Interlocking planks**: the logo mark, drawn as a large cropped white outline on teal panels.

## Shape

- Radius: 10px buttons and inputs, 16px cards (app cards), 20px photos and panels.
- Cards on grey are flat; one soft shadow only for things that float (dropdown menus, the card overlapping a hero).

## Imagery

- Real photography of Indonesian farmers, coffee, cocoa and rice (EUDR set, `why-it-matters.jpg`), and the team photo.
- Real app screenshots (`pasarmikro-mockup-home-4-520p-920p.png`) as product evidence.
- No AI-generated images (the old `impact.png` and `solution.png` carry AI watermarks) and no template stock photos.
- App-style flat illustrations only with original files from the design team.

## Hero

A slider of Markdown slides in `content/slides/` (rules in `content/slides/_RULES.md`): photo, headline, yellow highlight phrase, short text, one button. Three starter slides from existing content. Autoplay with a visible pause control, stops on hover and focus, no autoplay with reduced motion.

## Numbers

None for now (owner's decision). The impact section stays hidden until confirmed figures with a source are added to `content/impact/`.

## Dials

Dial: ENERGY 2 / RHYTHM 3 / MOTION 2

Reading this as: a B2B company site for buyers, exporters and funders sourcing from Indonesian smallholders, in the PasarMIKRO app's visual language (teal panels, yellow labels, white cards), photography-led.
