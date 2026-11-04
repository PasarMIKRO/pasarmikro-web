import { defaultLocale } from '../i18n';

// Old GitHub Pages URLs → new routes. Detail pages used `?id=` query strings; with a fresh
// database there is no id → slug mapping, so they land on their listing page.
const map: Record<string, string> = {
  '/kebijakan-privasi/': '/id/privacy-policy/',
  '/kepatuhan-eudr/': '/id/eudr/',
  '/case-study-details/': '/case-studies/',
  '/career-details/': '/career/',
  '/impact-dashboard/': '/impact/',
  '/blog/': '/insights/',
  '/blog-details/': '/insights/',
  '/platform-news/': '/insights/',
  '/service-details/': '/solutions/',
  '/terms-and-condition/': '/terms-and-conditions/',
  // No '/404/' entry: rendering the 404 page rewrites to /404 and runs this middleware again.
};

/** Returns the new path for a legacy URL path, or null when no redirect applies. */
export function legacyRedirect(pathname: string): string | null {
  let p = pathname.toLowerCase();
  const isHtml = p.endsWith('.html');
  if (p.endsWith('/index.html')) p = p.slice(0, -'index.html'.length);
  else if (isHtml) p = `${p.slice(0, -'.html'.length)}/`;
  else if (!p.endsWith('/')) p += '/';

  // The default language has no prefix, but people (and old links) try /en/...: send them to the real page.
  const prefix = `/${defaultLocale}/`;
  if (p.startsWith(prefix)) return map[p.slice(prefix.length - 1)] ?? p.slice(prefix.length - 1);

  // Any `.html` URL goes to its pretty form even when it isn't in the map.
  return map[p] ?? (isHtml ? p : null);
}
