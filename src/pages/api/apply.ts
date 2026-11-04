import type { APIRoute } from 'astro';
import { getRole } from '../../lib/content';
import { applicationRecord, applySchema, isValidCv, safeReturnPath } from '../../lib/forms';
import { saveToBase } from '../../lib/lark';
import { verifyTurnstile } from '../../lib/turnstile';

type Failure = 'verification' | 'invalid' | 'cv' | 'closed' | 'server';

// Job application form on /career/<slug>/. The application is saved to the Base with the CV file attached.
export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const form = await request.formData();
  const wantsJson = request.headers.get('accept')?.includes('application/json') ?? false;
  const back = safeReturnPath(form.get('return_to'));

  const respond = (status: number, error?: Failure) => {
    if (wantsJson) return Response.json({ ok: !error, error }, { status });
    const url = new URL(back, request.url);
    url.searchParams.set(error ? 'error' : 'sent', error ?? '1');
    url.hash = 'contact-form';
    return redirect(url.pathname + url.search + url.hash, 303);
  };

  if (!(await verifyTurnstile(form.get('cf-turnstile-response'), clientAddress))) return respond(403, 'verification');

  // A missing or unsuitable CV gets its own message; everything else is "check the fields".
  const cv = form.get('cv');
  if (!isValidCv(cv)) return respond(400, 'cv');
  const parsed = applySchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return respond(400, 'invalid');
  const app = parsed.data;

  const role = await getRole(app.locale, app.roleSlug);
  if (!role?.open) return respond(409, 'closed');

  return (await saveToBase('applications', applicationRecord(app, role.title), cv)) ? respond(200) : respond(502, 'server');
};
