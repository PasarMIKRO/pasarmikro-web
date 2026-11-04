// Pages that exist. Navigation, footer and in-page links only point at these, so no link
// leads to a 404 while the rest of the site is still being built. Add a path when its page ships.
import { solutions } from '../content/solutions';

const live = new Set<string>([
  '/',
  '/about/',
  '/solutions/',
  ...solutions.map((s) => `/solutions/${s.slug}/`),
  '/eudr/',
  '/contact/',
  '/privacy-policy/',
  '/terms-and-conditions/',
  '/case-studies/',
  '/insights/',
  '/faq/',
  '/team/',
  '/career/',
  '/life-at-pasarmikro/',
  // /impact/ is built but stays out of the menu until confirmed figures are in content/impact/.
]);

export const isLive = (path: string) => live.has(path);
