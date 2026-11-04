import { handle } from '@astrojs/cloudflare/handler';
import { preferredPath } from './lib/lang-pref';

// Astro's Worker, plus one step: a plain URL is answered in the language the reader picked
// (lang cookie), so switching language never changes the URL. Rules: src/lib/lang-pref.ts.
export default {
  async fetch(request: Request, env: Parameters<typeof handle>[1], ctx: Parameters<typeof handle>[2]) {
    const url = new URL(request.url);
    const target = request.method === 'GET' || request.method === 'HEAD' ? preferredPath(url.pathname, request.headers.get('cookie')) : null;
    if (!target) return handle(request, env, ctx);

    url.pathname = target;
    const res = await handle(new Request(url, request), env, ctx);
    const out = new Response(res.body, res);
    out.headers.append('Vary', 'Cookie');
    return out;
  },
};
