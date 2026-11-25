import { z } from 'zod';
import { locales, t, type Locale } from '../i18n';

const text = (max: number) => z.string().trim().max(max);
const optional = (max: number) =>
  text(max)
    .optional()
    .transform((v) => v || null);

// An answer that a spreadsheet would run as a formula once the Base is exported. Phone numbers (+62 ...) pass.
const FORMULA = /^(=|@|[+-][^\d\s]|[\t\r])/;

/** A Lark Base row keyed by column name; empty answers are left out so their cells stay blank. */
const row = (fields: Record<string, string | null>) =>
  Object.fromEntries(
    Object.entries(fields)
      .filter(([, v]) => v !== null)
      .map(([k, v]) => [k, FORMULA.test(v!) ? `'${v}` : v]),
  ) as Record<string, string>;

const TALANGIN_COMMODITIES = ['coffee', 'cocoa', 'rice', 'corn', 'fishery', 'other'] as const;
const TALANGIN_COMMODITY_LABELS: Record<(typeof TALANGIN_COMMODITIES)[number], string> = {
  coffee: 'Coffee',
  cocoa: 'Cocoa',
  rice: 'Rice',
  corn: 'Corn',
  fishery: 'Fishery products',
  other: 'Other',
};
/** Share of the buyer's purchase order that PasarMIKRO can pay the supplier upfront (Talangin). */
export const TALANGIN_ADVANCE_SHARE = 0.75;

const INSURANCE_ROLES = ['insurer', 'programme', 'agribusiness', 'other'] as const;
const INSURANCE_ROLE_LABELS: Record<(typeof INSURANCE_ROLES)[number], string> = {
  insurer: 'Insurer',
  programme: 'Development programme, funder or government',
  agribusiness: 'Agribusiness, trader or cooperative',
  other: 'Other',
};

/** Contact page, EUDR program, Talangin quote and embedded insurance forms. Each saves to its table in the Base. */
export const contactSchema = z.discriminatedUnion('source', [
  z.object({
    source: z.literal('contact'),
    locale: z.enum(locales as [Locale, ...Locale[]]),
    name: text(120).min(1),
    email: z.email().max(200),
    company: optional(200),
    phone: optional(50),
    message: text(5000).min(1),
  }),
  z.object({
    source: z.literal('eudr'),
    locale: z.enum(locales as [Locale, ...Locale[]]),
    name: text(120).min(1),
    email: z.email().max(200),
    company: text(200).min(1),
    phone: optional(50),
    commodity: z.enum(['coffee', 'cocoa', 'both']),
    role: z.enum(['exporter', 'cooperative', 'processor', 'eu-buyer']),
  }),
  // Talangin quote (/talangin/). Saved to the Contact table; a WhatsApp number or an email is enough.
  z
    .object({
      source: z.literal('talangin'),
      locale: z.enum(locales as [Locale, ...Locale[]]),
      name: text(120).min(1),
      email: z.union([z.literal(''), z.email().max(200)]).optional().transform((v) => v || null),
      company: optional(200),
      phone: optional(50),
      po: text(30).regex(/\d/),
      commodity: z.enum(TALANGIN_COMMODITIES),
      term: z.coerce.number().int().min(3).max(45),
    })
    .refine((v) => v.email || v.phone, { message: 'email or phone', path: ['phone'] }),
  // Embedded insurance enquiry (/embedded-insurance/). Saved to the Contact table; a WhatsApp number or an email is enough.
  z
    .object({
      source: z.literal('insurance'),
      locale: z.enum(locales as [Locale, ...Locale[]]),
      name: text(120).min(1),
      email: z.union([z.literal(''), z.email().max(200)]).optional().transform((v) => v || null),
      company: optional(200),
      phone: optional(50),
      role: z.enum(INSURANCE_ROLES),
      message: optional(2000),
    })
    .refine((v) => v.email || v.phone, { message: 'email or phone', path: ['phone'] }),
]);

export type ContactInput = z.infer<typeof contactSchema>;

/** Table and row for a contact or EUDR submission. Select answers use the English labels, the Base's option names. */
export function contactRecord(input: ContactInput) {
  const common = { Name: input.name, Email: input.email, Phone: input.phone, Language: t(input.locale).langName };
  if (input.source === 'contact') {
    return { table: 'contact' as const, fields: row({ ...common, Company: input.company, Message: input.message }) };
  }
  if (input.source === 'insurance') {
    const message = [
      'Embedded insurance enquiry (www.pasarmikro.id/embedded-insurance/)',
      `Role: ${INSURANCE_ROLE_LABELS[input.role]}`,
      input.message && `Interest: ${input.message}`,
    ]
      .filter(Boolean)
      .join('\n');
    return { table: 'contact' as const, fields: row({ ...common, Email: input.email, Company: input.company, Message: message }) };
  }
  if (input.source === 'talangin') {
    const po = Number(input.po.replace(/\D/g, ''));
    const rp = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
    const message = [
      'Talangin quote request (www.pasarmikro.id/talangin/)',
      `Buyer PO value: ${rp(po)}`,
      `Commodity: ${TALANGIN_COMMODITY_LABELS[input.commodity]}`,
      `Buyer payment term: ${input.term} days`,
      `Paid upfront to supplier (up to 75% of PO): ${rp(Math.floor(po * TALANGIN_ADVANCE_SHARE))}`,
    ].join('\n');
    return { table: 'contact' as const, fields: row({ ...common, Email: input.email, Company: input.company, Message: message }) };
  }
  const en = t('en').form;
  const fields = row({ ...common, Company: input.company, Commodity: en.commodities[input.commodity], Role: en.roles[input.role] });
  return { table: 'eudr' as const, fields };
}

/** Job application form (/career/<slug>/). The CV arrives as a file and is checked by `isValidCv`. */
export const applySchema = z.object({
  roleSlug: text(120).min(1),
  locale: z.enum(locales as [Locale, ...Locale[]]),
  name: text(120).min(1),
  email: z.email().max(200),
  phone: optional(50),
  linkedinUrl: optional(300).refine((v) => v === null || /^https:\/\//.test(v), 'https link'),
  message: optional(5000),
});

export function applicationRecord(app: z.infer<typeof applySchema>, roleTitle: string) {
  return row({
    Name: app.name,
    Role: roleTitle,
    Email: app.email,
    Phone: app.phone,
    LinkedIn: app.linkedinUrl,
    'Cover note': app.message,
    Language: t(app.locale).langName,
  });
}

// The team opens these files, so only document types are accepted. Keep in step with the form's `accept`.
export const CV_TYPES = ['.pdf', '.doc', '.docx'];
export const CV_MAX_BYTES = 5 * 1024 * 1024;

export function isValidCv(file: FormDataEntryValue | null): file is File {
  return (
    file instanceof File &&
    file.size > 0 &&
    file.size <= CV_MAX_BYTES &&
    CV_TYPES.some((ext) => file.name.toLowerCase().endsWith(ext))
  );
}

// First bytes of each accepted CV type. A PDF may have a few bytes before its header, so it is searched for.
const PDF_HEADER = '%PDF-';
const SIGNATURES: Record<string, number[]> = {
  '.docx': [0x50, 0x4b, 0x03, 0x04],
  '.doc': [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1],
};

/** True when the file's content matches its extension, so a renamed program or image is turned away. */
export async function hasCvSignature(file: File): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf')) return String.fromCharCode(...head).includes(PDF_HEADER);
  const sig = Object.entries(SIGNATURES).find(([ext]) => name.endsWith(ext))?.[1];
  return !!sig && sig.every((b, i) => head[i] === b);
}

// Largest form post each endpoint reads: a 5 MB CV plus fields (with room for a too-big CV to get its own
// message), and a contact message capped at 5,000 characters.
export const MAX_APPLY_BYTES = 10 * 1024 * 1024;
export const MAX_CONTACT_BYTES = 100 * 1024;

/** True when a form post is bigger than any real submission, or its size is unknown. Checked before reading it. */
export function bodyTooLarge(request: Request, max: number): boolean {
  const n = Number(request.headers.get('content-length'));
  return !(n > 0 && n <= max);
}

/** Only same-site paths are allowed as the redirect target after a no-JS submit. */
export function safeReturnPath(value: FormDataEntryValue | null): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}
