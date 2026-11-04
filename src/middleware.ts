import { defineMiddleware } from 'astro:middleware';
import { legacyRedirect } from './lib/redirects';

export const onRequest = defineMiddleware(async (context, next) => {
  const target = legacyRedirect(context.url.pathname);
  if (target) return context.redirect(target, 301); // query strings (old ?id=) are dropped on purpose

  return next();
});
