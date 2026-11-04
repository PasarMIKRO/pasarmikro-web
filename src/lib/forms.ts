import { z } from 'zod';
import { locales, t, type Locale } from '../i18n';

const text = (max: number) => z.string().trim().max(max);
const optional = (max: number) =>
  text(max)
    .optional()
    .transform((v) => v || null);

/** A Lark Base row keyed by column name; empty answers are left out so their cells stay blank. */
const row = (fields: Record<string, string | null>) =>
  Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== null)) as Record<string, string>;

/** Contact page and EUDR program form. Each saves to its own table in the Base. */
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
]);

export type ContactInput = z.infer<typeof contactSchema>;

/** Table and row for a contact or EUDR submission. Select answers use the English labels, the Base's option names. */
export function contactRecord(input: ContactInput) {
  const common = { Name: input.name, Email: input.email, Phone: input.phone, Language: t(input.locale).langName };
  if (input.source === 'contact') {
    return { table: 'contact' as const, fields: row({ ...common, Company: input.company, Message: input.message }) };
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

/** Only same-site paths are allowed as the redirect target after a no-JS submit. */
export function safeReturnPath(value: FormDataEntryValue | null): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}
