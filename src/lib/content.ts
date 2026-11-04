import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { defaultLocale, locales, t, type Locale } from '../i18n';

// Reads the Markdown content in /content (rules: content/README.md).
// Long-text types live in content/<type>/<en|id>/<slug>.md; the id is "<locale>/<slug>".

export type PostType = 'case-study' | 'insight' | 'news';
type Localized = 'posts' | 'faq' | 'careers' | 'life';

/** Unprefixed listing path for a post type. */
export const postBase = (type: PostType) => (type === 'case-study' ? '/case-studies/' : '/insights/');

const split = (id: string) => {
  const [locale, ...rest] = id.split('/');
  return { locale: locale as Locale, slug: rest.join('/') };
};

export type LocalizedEntry<C extends Localized> = CollectionEntry<C> & { locale: Locale; slug: string; foreign: boolean };

/**
 * Entries in the page's language, plus entries that only exist in the other language (marked
 * `foreign`), so a language with fewer translations is never empty.
 */
async function localized<C extends Localized>(collection: C, locale: Locale, keep: (e: CollectionEntry<C>) => boolean) {
  const all = ((await getCollection(collection)) as CollectionEntry<C>[]).filter(keep).map((e) => ({ ...e, ...split(e.id) }));
  const local = new Set(all.filter((e) => e.locale === locale).map((e) => e.slug));
  return all.filter((e) => e.locale === locale || !local.has(e.slug)).map((e) => ({ ...e, foreign: e.locale !== locale })) as LocalizedEntry<C>[];
}

/** One entry in one language, and whether every other language has it too (for hreflang). */
async function localizedEntry<C extends Localized>(collection: C, locale: Locale, slug: string) {
  const entry = (await getEntry(collection, `${locale}/${slug}`)) as CollectionEntry<C> | undefined;
  if (!entry) return null;
  const others = await Promise.all(locales.filter((l) => l !== locale).map((l) => getEntry(collection, `${l}/${slug}`)));
  return { entry, translated: others.every(Boolean) };
}

/** Static paths for every entry of a localized collection: { lang, slug } with the entry as a prop. */
export async function localizedPaths<C extends Localized>(collection: C, keep: (e: CollectionEntry<C>) => boolean) {
  const all = ((await getCollection(collection)) as CollectionEntry<C>[]).filter(keep);
  const ids = new Set(all.map((e) => e.id));
  return all.map((e) => {
    const { locale, slug } = split(e.id);
    return {
      params: { lang: locale === defaultLocale ? undefined : locale, slug },
      props: { entry: e, locale, translated: locales.every((l) => ids.has(`${l}/${slug}`)) },
    };
  });
}

export const isPublishedPost = (types: PostType[]) => (p: CollectionEntry<'posts'>) => !p.data.draft && types.includes(p.data.type);

export async function getPostList(types: PostType[], locale: Locale) {
  return (await localized('posts', locale, isPublishedPost(types))).sort((a, b) => +b.data.publishedAt - +a.data.publishedAt);
}

export async function getSlides() {
  return (await getCollection('slides', (s) => s.data.active)).sort((a, b) => a.data.order - b.data.order);
}

export const KPI_ORDER = ['farmers', 'total_impact', 'talangin_impact', 'commodities', 'area'] as const;

export async function getImpactMetrics() {
  const rows = await getCollection('impact');
  return KPI_ORDER.flatMap((k) => rows.filter((r) => r.data.metric === k));
}

export async function getCommodities() {
  return (await getCollection('commodities')).sort((a, b) => a.data.order - b.data.order || b.data.tradeValueIdr - a.data.tradeValueIdr);
}

export async function getTestimonials() {
  return (await getCollection('testimonials')).sort((a, b) => a.data.order - b.data.order);
}

export async function getFaqs(locale: Locale) {
  return (await localized('faq', locale, (q) => !q.data.draft)).sort((a, b) => a.data.order - b.data.order);
}

export async function getTeam() {
  return (await getCollection('team', (m) => m.data.active)).sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export async function getOpenRoles(locale: Locale) {
  return (await localized('careers', locale, (r) => r.data.open)).sort((a, b) => +b.data.postedAt - +a.data.postedAt);
}

/** An open or closed role by slug, in the requested language, falling back to any other one. */
export async function getRole(locale: Locale, slug: string) {
  for (const l of [locale, ...locales.filter((x) => x !== locale)]) {
    const found = await localizedEntry('careers', l, slug);
    if (found) return found.entry.data;
  }
  return null;
}

export async function getEvents(locale: Locale) {
  return (await localized('life', locale, (e) => !e.data.draft)).sort((a, b) => +b.data.date - +a.data.date);
}

export { localizedEntry };

/** "14 August 2025" / "14 Agustus 2025". */
export const formatDate = (d: Date | null | undefined, locale: Locale) =>
  d ? new Intl.DateTimeFormat(t(locale).intl, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(d) : '';
