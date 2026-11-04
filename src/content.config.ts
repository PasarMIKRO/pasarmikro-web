import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { locales, type Locale } from './i18n';

// Website content lives in /content as Markdown, one file per item. The rules for writing each
// type are in content/README.md and content/<type>/_RULES.md. Files starting with "_" are ignored.
// These schemas are the contract: `npm run check` fails with a clear message when a file breaks it.

const files = (dir: string) => glob({ pattern: '**/[!_]*.md', base: `./content/${dir}` });

const text = (max: number) => z.string().trim().min(1).max(max);
// A short field written in every language, e.g. title: { en: ..., id: ... }.
const both = <T extends z.ZodType>(schema: T) => z.object(Object.fromEntries(locales.map((l) => [l, schema])) as Record<Locale, T>);
const sitePathOrHttps = z.string().regex(/^(\/[a-z0-9\-/]*|https:\/\/\S+)$/, 'Use a site path like /eudr/ or a full https:// link');
const order = z.number().int().min(0).default(100);

const slides = defineCollection({
  loader: files('slides'),
  schema: ({ image }) =>
    z.object({
      order,
      active: z.boolean().default(true),
      title: both(text(90)),
      highlight: both(text(40)).optional(),
      body: both(text(220)),
      cta: z.object({ label: both(text(30)), href: sitePathOrHttps }).optional(),
      image: image(),
      imageAlt: both(text(160)),
    }),
});

const posts = defineCollection({
  loader: files('posts'),
  schema: ({ image }) =>
    z
      .object({
        type: z.enum(['case-study', 'insight', 'news']),
        title: text(120),
        excerpt: text(300),
        publishedAt: z.coerce.date(),
        author: text(80).default('PasarMIKRO'),
        tags: z.array(text(40)).max(8).default([]),
        cover: image().optional(),
        coverAlt: text(160).optional(),
        draft: z.boolean().default(false),
      })
      .refine((p) => !p.cover || p.coverAlt, { message: 'coverAlt is required when there is a cover image', path: ['coverAlt'] }),
});

const faq = defineCollection({
  loader: files('faq'),
  schema: z.object({ question: text(200), order, draft: z.boolean().default(false) }),
});

const careers = defineCollection({
  loader: files('careers'),
  schema: z.object({
    title: text(100),
    location: text(80),
    employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
    open: z.boolean().default(true),
    postedAt: z.coerce.date(),
  }),
});

const life = defineCollection({
  loader: files('life'),
  schema: ({ image }) =>
    z.object({
      name: text(100),
      date: z.coerce.date(),
      cover: image(),
      coverAlt: text(160),
      gallery: z.array(z.object({ src: image(), alt: text(160) })).max(24).default([]),
      draft: z.boolean().default(false),
    }),
});

const team = defineCollection({
  loader: files('team'),
  schema: ({ image }) =>
    z.object({
      name: text(80),
      role: text(80), // English only: job titles are not translated
      division: text(60),
      order,
      linkedin: z.string().regex(/^https:\/\/(www\.)?linkedin\.com\//, 'Use a full https://www.linkedin.com/... link').optional(),
      photo: image().optional(),
      active: z.boolean().default(true),
    }),
});

const testimonials = defineCollection({
  loader: files('testimonials'),
  schema: ({ image }) =>
    z.object({
      name: text(80),
      role: both(text(80)),
      quote: both(text(400)),
      photo: image().optional(),
      order,
      // A real person who agreed to be quoted. The build refuses a testimonial without it.
      consent: z.literal(true, { message: 'Only publish quotes from real customers who agreed; set consent: true once they have' }),
    }),
});

// Impact figures must say where they come from and when they were measured.
const evidence = { asOf: z.coerce.date(), source: text(200) };

const impact = defineCollection({
  loader: files('impact/metrics'),
  schema: z.object({
    metric: z.enum(['farmers', 'total_impact', 'talangin_impact', 'commodities', 'area']),
    value: text(20),
    unit: both(z.string().trim().max(20)).optional(),
    ...evidence,
  }),
});

const commodities = defineCollection({
  loader: files('impact/commodities'),
  schema: ({ image }) =>
    z.object({
      name: both(text(40)),
      tradeValueIdr: z.number().nonnegative(),
      tonnage: z.number().nonnegative().optional(),
      image: image().optional(),
      order,
      ...evidence,
    }),
});

export const collections = { slides, posts, faq, careers, life, team, testimonials, impact, commodities };
