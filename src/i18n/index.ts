import en from './en.json';
import id from './id.json';

// Every language the site has. To add one: copy en.json to <code>.json, translate it,
// and add it here. The type checker then lists every page and content field still missing it.
// The first entry is the default language and has no URL prefix.
const dicts = { en, id } satisfies Record<string, typeof en>;

export type Locale = keyof typeof dicts;
export type Dict = typeof en;
export const locales = Object.keys(dicts) as Locale[];
export const defaultLocale: Locale = locales[0];

export function t(locale: Locale): Dict {
  return dicts[locale];
}

const isLocale = (s: string): s is Locale => (locales as string[]).includes(s);

/** `[...lang]` route param → locale; null means "not a locale", so the page should 404. */
export function localeFromParam(lang: string | undefined): Locale | null {
  if (lang === undefined || lang === '') return defaultLocale;
  return lang !== defaultLocale && isLocale(lang) ? lang : null;
}

/** getStaticPaths for prerendered `[...lang]` pages. */
export function localeStaticPaths() {
  return locales.map((l) => ({ params: { lang: l === defaultLocale ? undefined : l } }));
}

/** `/about/` → `/id/about/` for Indonesian. Paths are always unprefixed with a leading slash. */
export function localePath(locale: Locale, path: string): string {
  return locale === defaultLocale ? path : `/${locale}${path}`;
}

/** The language of a URL path from its prefix, e.g. `/id/faq/` → `id`. */
export function localeOfPath(pathname: string): Locale {
  const prefix = pathname.split('/')[1];
  return prefix && prefix !== defaultLocale && isLocale(prefix) ? prefix : defaultLocale;
}
