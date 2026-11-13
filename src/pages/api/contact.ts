import type { APIRoute } from 'astro';
import { bodyTooLarge, contactRecord, contactSchema, MAX_CONTACT_BYTES, safeReturnPath } from '../../lib/forms';
import { saveToBase } from '../../lib/lark';
import { verifyTurnstile } from '../../lib/turnstile';

// Public form endpoint for /contact/ and the EUDR page. JS clients get JSON; plain form posts get a 303 back.
export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const wantsJson = request.headers.get('accept')?.includes('application/json') ?? false;
  if (bodyTooLarge(request, MAX_CONTACT_BYTES)) {
    return wantsJson ? Response.json({ ok: false, error: 'invalid' }, { status: 413 }) : new Response('Message too large', { status: 413 });
  }
  const form = await request.formData();
  const back = safeReturnPath(form.get('return_to'));

  const respond = (status: number, error?: 'verification' | 'invalid' | 'server') => {
    if (wantsJson) return Response.json({ ok: !error, error }, { status });
    const url = new URL(back, request.url);
    url.searchParams.set(error ? 'error' : 'sent', error ?? '1');
    url.hash = 'contact-form';
    return redirect(url.pathname + url.search + url.hash, 303);
  };

  if (!(await verifyTurnstile(form.get('cf-turnstile-response'), clientAddress))) return respond(403, 'verification');

  const parsed = contactSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return respond(400, 'invalid');

  // The Base is the only copy of the message, so the visitor only sees "sent" once the row is saved.
  const { table, fields } = contactRecord(parsed.data);
  return (await saveToBase(table, fields)) ? respond(200) : respond(502, 'server');
};
