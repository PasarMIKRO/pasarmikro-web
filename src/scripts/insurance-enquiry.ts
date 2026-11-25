// Embedded insurance page (/embedded-insurance/): the enquiry form saves to the Lark Base via /api/contact
// (source "insurance") and then offers the same enquiry on WhatsApp; the "who it's for" cards pre-select
// the visitor's role.
// Strings come in both languages because the header switch can change language in place.
import i18n from '../components/insurance/enquiry-i18n.json';
import { site } from '../lib/site';

type TurnstileApi = { reset: (el?: Element) => void };
type Gtag = (...args: unknown[]) => void;
type Lang = keyof typeof i18n;
type Field = { value: string; focus: () => void; checkValidity?: () => boolean };

const lang = (): Lang => (document.documentElement.lang === 'id' ? 'id' : 'en');
const gtag = () => (window as unknown as { gtag?: Gtag }).gtag;

const form = document.querySelector<HTMLFormElement>('[data-insurance-form]');
if (form) {
  const field = (name: string) => form.elements.namedItem(name) as unknown as Field;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const fields = form.querySelector<HTMLElement>('[data-enquiry-fields]')!;
  const done = form.querySelector<HTMLElement>('[data-enquiry-done]')!;
  const wa = form.querySelector<HTMLAnchorElement>('[data-enquiry-wa]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;

  // "Enquire as an insurer" and friends: choose that role in the form, then let the link scroll there.
  for (const link of document.querySelectorAll<HTMLElement>('[data-role]')) {
    link.addEventListener('click', () => {
      field('role').value = link.dataset.role ?? 'other';
    });
  }

  const waLink = () => {
    const s = i18n[lang()];
    const v = (n: string) => field(n).value.trim();
    const role = s.roles[v('role') as keyof typeof s.roles] ?? '';
    const lines = [
      s.wa.intro,
      `${s.wa.name}: ${v('name')}`,
      v('company') && `${s.wa.org}: ${v('company')}`,
      `${s.wa.role}: ${role}`,
      v('phone') && `${s.wa.phone}: ${v('phone')}`,
      v('email') && `Email: ${v('email')}`,
      v('message') && `${s.wa.msg}: ${v('message')}`,
      s.wa.src,
    ].filter(Boolean);
    return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  const show = (text: string, offerWhatsApp = false) => {
    status.textContent = text;
    if (offerWhatsApp) {
      // Not saved: give the visitor the WhatsApp route so the enquiry is not lost.
      const link = document.createElement('a');
      link.href = waLink();
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = ' WhatsApp →';
      link.style.fontWeight = '700';
      // The Workers types shadow the DOM's append(); the browser's version takes an element.
      (status as unknown as { append: (node: unknown) => void }).append(link);
    }
    status.hidden = false;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const s = i18n[lang()];
    const email = field('email');
    if (!field('name').value.trim()) return show(s.errors.name), field('name').focus();
    if (!field('phone').value.trim() && !email.value.trim()) return show(s.errors.contact), field('phone').focus();
    if (email.value.trim() && email.checkValidity && !email.checkValidity()) return show(s.errors.email), email.focus();

    wa.href = waLink();
    status.hidden = true;
    const label = button.textContent;
    button.disabled = true;
    button.textContent = s.sending;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { accept: 'application/json' } });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        gtag()?.('event', 'generate_lead', { form: 'insurance', page_path: location.pathname });
        fields.hidden = true;
        done.hidden = false;
        done.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }
      if (data.error === 'verification') show(s.errors.verification);
      else show(s.errors.server, true);
    } catch {
      show(s.errors.server, true);
    } finally {
      button.disabled = false;
      button.textContent = label;
      (window as unknown as { turnstile?: TurnstileApi }).turnstile?.reset(form.querySelector('.cf-turnstile') ?? undefined);
    }
  });
}

// Which buttons lead to enquiries: GA4 click events by location.
document.addEventListener('click', (e) => {
  const el = (e.target as Element | null)?.closest<HTMLElement>('[data-cta], a[href="#partner"]');
  if (el) gtag()?.('event', 'cta_click', { page: 'embedded-insurance', cta_location: el.dataset.cta ?? 'section' });
});
