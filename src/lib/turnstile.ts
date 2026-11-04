import { env } from 'cloudflare:workers';

/** Server-side Cloudflare Turnstile check. Every form endpoint calls this before doing anything else. */
export async function verifyTurnstile(token: FormDataEntryValue | null, ip?: string): Promise<boolean> {
  if (typeof token !== 'string' || !token) return false;

  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('turnstile siteverify', err);
    return false;
  }
}
