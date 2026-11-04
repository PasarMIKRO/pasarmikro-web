# PasarMIKRO website

Astro 7 on Cloudflare Workers. Page content is Markdown in [`content/`](content/README.md), written by the team (with AI help) and checked by the build. Forms save to the team's Lark Base, protected by Cloudflare Turnstile. Design direction: [DESIGN.md](DESIGN.md).

## Deploy to Cloudflare

You need Node 24, a Cloudflare account, and `pasarmikro.id` added to that account as a zone. The site has no `workers.dev` address, so it is only reachable once the domain is attached (step 6).

### First deploy

1. **Log in to Cloudflare** from this folder: `npx wrangler login`.
2. **Turnstile** (the bot check on every form): the widget for `www.pasarmikro.id` and `pasarmikro.id` is in the Cloudflare dashboard under Turnstile. Its **site key** is `TURNSTILE_SITE_KEY` in `wrangler.jsonc` (already set); its **secret key** is a secret (step 4). Local development uses Cloudflare's always-pass test keys from `.dev.vars`.
3. **Lark** (where form submissions are saved). Already set up; check it if the forms fail:
   - The app in `LARK_APP_ID` (`wrangler.jsonc`) has exactly two app (tenant) permissions in a published version: `base:record:create` and `docs:document.media:upload`.
   - The app is added to the Base in `LARK_BASE_TOKEN` with **Can edit** (in the Base: "..." → Add document app).
   - The Base has the tables `LARK_TABLE_CONTACT`, `LARK_TABLE_EUDR` and `LARK_TABLE_APPLICATIONS`. The website writes to columns by name, so renaming a column breaks that form.
4. **Secrets**: see the table below. Run each command and paste the value when asked.
5. **Deploy**: `npm run deploy` (builds, then uploads the Worker).
6. **Attach the domain**: Cloudflare dashboard → Workers & Pages → `pasarmikro-web` → Settings → Domains & Routes → Add → Custom domain → `www.pasarmikro.id`.
7. **Check**: open https://www.pasarmikro.id/contact/, send a test message, and see the row appear in the Contact table. If it fails, `npx wrangler tail` shows the error.

### Secrets

Secrets live in Cloudflare, never in the repo. `npx wrangler secret list` shows which ones are set.

| Secret | Where to get it | Command |
|---|---|---|
| `TURNSTILE_SECRET` | Cloudflare dashboard → Turnstile → your widget → **Secret key** | `npx wrangler secret put TURNSTILE_SECRET` |
| `LARK_APP_SECRET` | [Lark Developer Console](https://open.larksuite.com/app) → the app in `LARK_APP_ID` → Credentials & Basic Info → **App Secret** | `npx wrangler secret put LARK_APP_SECRET` |

Everything else (Turnstile site key, Lark app ID, Base and table IDs) is not secret and lives under `vars` in `wrangler.jsonc`. For local development the same two secrets go in `.dev.vars` (see below). If you reset the Lark App Secret, update it in both places.

### Later deploys

`npm run deploy`. Content and code changes go live only when deployed. Secrets and the domain stay as they are.

## Editing content

Read [content/README.md](content/README.md): it explains every content type, the writing rules, images, and a prompt to give your AI assistant. Run `npm run check` before committing; it fails with the file and field when something breaks the rules.

## Local development

Requires Node 24 (`.nvmrc`).

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

Open http://localhost:4321. With `LARK_APP_SECRET` empty, form submissions are printed in the terminal instead of saved. Restart `npm run dev` after adding a new content type or changing `src/content.config.ts`.

- `npm run check`: type check, content schemas and content writing rules
- `npm test`: unit tests
- `npm run build`: production build; `npx wrangler dev` then serves it locally

## How it is built

- Almost every page is generated at build time from `content/` and `src/`. A content change goes live when it is merged and deployed.
- Server-rendered at request time: the two form endpoints (`/api/contact`, `/api/apply`), the contact page, open role pages (they show the form result) and the EUDR page (its early-joiner offer switches off by itself after 13 November 2026).
- No database of its own. Each form saves a row to its table in the team's Lark Base (Contact, EUDR, Job Applications), with the applicant's CV attached. If Lark does not accept the row, the visitor sees an error and is asked to email instead.

## Languages

A page has one URL in every language. The reader's choice is kept in a `lang` cookie:

- The header switch swaps the page's text in place with a short fade (`src/scripts/lang-switch.ts`). The URL, scroll position, open menus and half-filled forms stay as they are.
- On every later page, the Worker (`src/worker.ts`, rules in `src/lib/lang-pref.ts`) answers the plain URL in that language.
- Each language is still built under its own prefix (`/id/faq/`). Search engines index those through hreflang and the sitemap, and a visitor who arrives on one sees the plain URL in the address bar.

The site's interface text (menus, buttons, form labels, page copy) lives in one JSON file per language in `src/i18n/`.

To add a language, for example Chinese (`zh`):

1. Copy `src/i18n/en.json` to `src/i18n/zh.json` and translate the values. Keep the keys. Set `langName` (the name in its own language, e.g. `中文`), `intl` (the date and number format, e.g. `zh-CN`) and `ogLocale` (for social previews, e.g. `zh_CN`).
2. Import it in `src/i18n/index.ts` and add it to `dicts`. Its pages are then served under `/zh/`, and it appears in the header switch and the sitemap.
3. Run `npm run check`. The type checker lists every place that still needs the new language: the short `en:`/`id:` fields in `content/`, the EUDR page (`src/components/eudr/`), and a few per-language texts in the pages.
4. Add Markdown content in a `zh/` folder for posts, FAQ, roles and life (see `content/README.md`).

The header switch shows one button per language. Past three or four languages it should become a dropdown.
