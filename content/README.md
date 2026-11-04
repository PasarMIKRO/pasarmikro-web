# Website content guide

Everything that changes on www.pasarmikro.id lives in this folder as Markdown files: hero slides, case studies and articles, FAQ, team, open roles, life at PasarMIKRO, testimonials and impact figures. Your AI assistant writes the files, a person on the team checks them, and the build refuses anything that breaks the rules below.

Read this file first, then the `_RULES.md` of the content type you are working on.

| Folder | What it is | Shows on | Rules |
|---|---|---|---|
| `slides/` | Homepage hero slider | `/` | [slides/_RULES.md](slides/_RULES.md) |
| `posts/` | Case studies, insights, platform news | `/case-studies/`, `/insights/` | [posts/_RULES.md](posts/_RULES.md) |
| `faq/` | Frequently asked questions | `/faq/` | [faq/_RULES.md](faq/_RULES.md) |
| `careers/` | Open roles | `/career/` | [careers/_RULES.md](careers/_RULES.md) |
| `life/` | Team events and field visits | `/life-at-pasarmikro/` | [life/_RULES.md](life/_RULES.md) |
| `team/` | Team members | `/team/` | [team/_RULES.md](team/_RULES.md) |
| `testimonials/` | Customer quotes | Homepage | [testimonials/_RULES.md](testimonials/_RULES.md) |
| `impact/` | Impact numbers and trade value per commodity | Homepage, `/impact/` | [impact/_RULES.md](impact/_RULES.md) |

Pages that are written once and rarely change (Solutions, EUDR, About, legal pages) are not in this folder; ask a developer to change them.

## How to add or change content

1. Copy the `_template.md` from the content type's folder and rename it (see "File names" below).
2. Fill it in, or give your AI assistant the prompt at the bottom of this file together with the type's `_RULES.md`.
3. Put any photos in that folder's `images/` folder.
4. Run `npm run check`. It lists every problem with the file name and field. Fix them until it passes.
5. Preview with `npm run dev` and open the page.
6. Commit on a branch and open a pull request. The site updates when it is merged and deployed.

To hide something without deleting it, set `draft: true` (posts, FAQ, life) or `active: false` (slides, team), or `open: false` for a role that is filled.

## File names

- Lowercase words joined by hyphens, ending in `.md`: `ngawi-rice-traders.md`. No spaces, capitals, dates or accents.
- The file name is the page address. `posts/en/ngawi-rice-traders.md` becomes `/case-studies/ngawi-rice-traders/`.
- Never rename a published file: the old address stops working.
- Files starting with `_` are instructions and templates. The website ignores them.

## English and Indonesian

- Content with long text (posts, FAQ, roles, life) has one file per language: `en/` and `id/` folders. **Use the same file name in both** so the two versions link to each other.
- Short items (slides, testimonials, impact) keep both languages in one file, as `en:` and `id:` pairs. Team job titles are English only.
- Indonesian is written for Indonesian readers, not translated word for word. Use "Anda", natural Bahasa Indonesia, and keep established terms (EUDR, KYC, Talangin) as they are.
- If only one language is ready, publish it. The other language's listing still shows it, marked with its language.

## Writing rules (all content)

**Be true.** These are not style preferences: they protect the company.

- Never invent facts: no made-up numbers, customers, partners, quotes, awards, people, dates or results. If the source material does not say it, leave it out or ask.
- Every number needs a source you can point to (an internal report, a dashboard export, a signed agreement). Impact figures must record `source` and `asOf`.
- Testimonials only from real customers who agreed to be quoted (`consent: true`).
- No promises the team cannot keep ("we reply within 1 hour", "guaranteed approval").
- Name partners (IKEA, Unilever, Conservana and so on) only for work that really happened and can be mentioned publicly.

**Sound like PasarMIKRO.** Practical, warm, specific, on the side of farmers and traders. Write for a busy reader:

- Lead with what the reader gets or needs to do. Short paragraphs, plain words, active voice ("we map the plots", not "plots are mapped").
- Be specific: commodity, region, volume, what changed. "Collectors in Lampung now record each purchase in the app" beats "we transformed the supply chain".
- Headings in sentence case ("How Talangin works"), not Title Case or ALL CAPS.
- No em dashes (—). Use a comma, a period, a colon or parentheses.
- No emoji, no exclamation marks (except inside a real quote).
- Avoid these words: seamless, revolutionary, cutting-edge, game-changer, next-generation, world-class, leverage, unlock, empower, robust, synergy, best-in-class, innovative. Say what the thing does instead.
- Brand names exactly: PasarMIKRO, Talangin, Mikro ERP, EUDR, #MikroHeroes.

`npm run check` flags em dashes, placeholder text (TODO, lorem ipsum, [REAL DATA]) and missing translations. It cannot check whether a fact is true: that is the reviewer's job.

## Images

- Real photos only: your own or ones you have the rights to use. **Do not use AI-generated photos** of farms, people or places as if they were real.
- JPG, PNG or WebP, under 2 MB. Cover and slide photos landscape, at least 1600 px wide. Team photos square, at least 600 px.
- Put them in the content type's `images/` folder and refer to them from the file: `cover: ./images/ngawi-rice.jpg` (posts: `../images/...` because of the language folder).
- Every image needs a short description (`coverAlt`, `imageAlt`, `alt`) of what it shows, for screen readers: "A collector weighing coffee cherries at a farm in Lampung", not "image" or "photo".
- The site resizes and compresses images automatically.

## Prompt for your AI assistant

Paste this, then attach or paste the type's `_RULES.md`, its `_template.md`, and your source material (notes, report, interview, photos list):

```
You are writing website content for PasarMIKRO (www.pasarmikro.id), an Indonesian agri-trade platform
for smallholder farmers, traders and cooperatives, and the companies that buy from them.

Follow the attached content guide and _RULES.md exactly:
- Output one Markdown file per item, starting with the YAML frontmatter from the template.
- Use only facts from my source material. Do not invent numbers, names, quotes, customers or dates.
  If something the template asks for is missing, write "MISSING: <what>" in that field and list it
  at the end so I can fill it in.
- No em dashes, no emoji, no buzzwords, headings in sentence case.
- Write the English and Indonesian versions separately; the Indonesian must read naturally, not as a
  word-for-word translation.
- Suggest the file name (lowercase-with-hyphens.md).

Source material:
<paste here>
```

`MISSING:` values are rejected by `npm run check`, so nothing half-finished can go live by accident.
