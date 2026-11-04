// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { defaultLocale, localePath, locales } from './src/i18n/index.ts';

// Open role pages per language (they are server-rendered, so the sitemap needs them listed).
const openRolePaths = locales.flatMap((lang) => {
  const dir = `./content/careers/${lang}`;
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_') && !/^open:\s*false/m.test(readFileSync(`${dir}/${f}`, 'utf8')))
    .map((f) => localePath(lang, `/career/${f.replace(/\.md$/, '')}/`));
});

// https://astro.build/config
export default defineConfig({
  site: 'https://www.pasarmikro.id',
  // Most pages are prerendered from /content; forms and the EUDR page are server-rendered.
  output: 'server',

  // No Astro sessions, so the Cloudflare adapter does not create a KV namespace.
  session: false,

  adapter: cloudflare({ imageService: 'compile' }),

  i18n: {
    defaultLocale,
    locales,
    routing: { prefixDefaultLocale: false },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      // Server-rendered pages are not discovered automatically: the EUDR and contact pages, and open roles.
      customPages: [...['/eudr/', '/contact/'].flatMap((p) => locales.map((l) => localePath(l, p))), ...openRolePaths].map((p) => `https://www.pasarmikro.id${p}`),
      i18n: { defaultLocale, locales: Object.fromEntries(locales.map((l) => [l, l])) },
    }),
  ],
});
