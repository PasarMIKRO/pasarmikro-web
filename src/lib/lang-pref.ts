import { locales, type Locale } from '../i18n';
import { legacyRedirect } from './redirects';

// The reader's language lives in a cookie, so a page keeps one URL in every language.
// Pages are still built under /id/... (search engines index those through hreflang and the
// sitemap); src/worker.ts serves that version at the plain URL when the cookie asks for it.

export const LANG_COOKIE = 'lang';

/** The language chosen in the Cookie header, if it is a known one. */
export function cookieLocale(cookieHeader: string | null): Locale | null {
  const value = cookieHeader?.match(new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=([^;]+)`))?.[1];
  return value && (locales as string[]).includes(value) ? (value as Locale) : null;
}

/** The built page to serve for a plain URL in the reader's language, or null to serve it as is. */
export function preferredPath(pathname: string, cookieHeader: string | null): string | null {
  const lang = cookieLocale(cookieHeader);
  if (!lang || lang === locales[0]) return null;
  // Only page URLs: not files, API routes or Astro's assets. Without a trailing slash the
  // asset server redirects first, and the redirected request comes back here.
  if (!pathname.endsWith('/') || pathname.startsWith('/api/') || pathname.startsWith('/_')) return null;
  // Already in a language folder (or /en/..., which redirects), or an old URL that redirects.
  if ((locales as string[]).includes(pathname.split('/')[1]) || legacyRedirect(pathname)) return null;
  return `/${lang}${pathname}`;
}
