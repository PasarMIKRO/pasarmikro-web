# FAQ

Questions and answers on `/faq/` (the page also tells search engines they are FAQs). EUDR questions belong on the EUDR page, not here.

**Files:** `content/faq/en/<name>.md` and `content/faq/id/<name>.md`, one question per file, same file name in both languages. Name the file after the question: `what-is-talangin.md`.

| Field | Required | Rules |
|---|---|---|
| `question` | yes | The question as a real user would ask it, max 200 characters, ending with `?`. |
| `order` | yes | Whole number; lower shows first. Use the same number in both languages. |
| `draft` | no | `true` hides it. |

**Answer (the body):** 1 to 4 short paragraphs or a short list. Answer the question in the first sentence, then give the detail. Link to the page that explains more (`/solutions/embedded-finance/`). Only questions people actually ask: from sales calls, WhatsApp, support tickets. Do not write questions to fill the page.

## Example

```md
---
question: What is Talangin?
order: 2
---

Talangin is PasarMIKRO's working capital for traders and suppliers. ...

See [how Talangin works](/solutions/embedded-finance/).
```
