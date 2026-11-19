// Talangin quote form (/talangin/): live estimate, then saves the request to the Lark Base via
// /api/contact (source "talangin") and offers the same request on WhatsApp to the Talangin team.
// Strings come in both languages because the header switch can change language in place.
import i18n from '../components/talangin/quote-i18n.json';

type TurnstileApi = { reset: (el?: Element) => void };
type Lang = keyof typeof i18n;

const WA = '6285157570025';
const ADVANCE_SHARE = 0.75;

const lang = (): Lang => (document.documentElement.lang === 'id' ? 'id' : 'en');
const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
const digits = (v: string) => Number(v.replace(/\D/g, '')) || 0;

for (const form of document.querySelectorAll<HTMLFormElement>('[data-talangin-quote]')) {
  const field = <T extends HTMLElement>(name: string) => form.elements.namedItem(name) as unknown as T;
  const po = field<HTMLInputElement>('po');
  const term = field<HTMLInputElement>('term');
  const termOut = form.querySelector<HTMLOutputElement>('[data-term-out]')!;
  const advanceOut = form.querySelector<HTMLOutputElement>('[data-advance-out]')!;
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const fields = form.querySelector<HTMLElement>('[data-quote-fields]')!;
  const done = form.querySelector<HTMLElement>('[data-quote-done]')!;
  const wa = form.querySelector<HTMLAnchorElement>('[data-quote-wa]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;

  const update = () => {
    const s = i18n[lang()];
    termOut.value = `${term.value} ${s.unit}`;
    const value = digits(po.value);
    advanceOut.value = value ? rp(Math.floor(value * ADVANCE_SHARE)) : 'Rp –';
  };
  // Thousand separators as the visitor types (',' in EN, '.' in ID); the caret stays after the same digit.
  const formatPo = (keepCaret: boolean) => {
    const caretDigits = po.value.slice(0, po.selectionStart ?? po.value.length).replace(/\D/g, '').length;
    const value = digits(po.value);
    po.value = value ? value.toLocaleString(lang() === 'id' ? 'id-ID' : 'en-US') : '';
    if (!keepCaret) return;
    let i = 0;
    for (let seen = 0; i < po.value.length && seen < caretDigits; i++) if (/\d/.test(po.value[i])) seen++;
    po.setSelectionRange(i, i);
  };
  po.addEventListener('input', () => (formatPo(true), update()));
  term.addEventListener('input', update);
  new MutationObserver(() => (formatPo(false), update())).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  update();

  const show = (text: string, offerWhatsApp = false) => {
    status.textContent = text;
    if (offerWhatsApp) {
      // The request was not saved: give the visitor the WhatsApp route so the lead is not lost.
      const link = document.createElement('a');
      link.href = waLink();
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = ' WhatsApp →';
      link.style.fontWeight = '700';
      // The Workers types shadow the DOM's append(); the browser's version takes an element.
      (status as unknown as { append: (node: unknown) => void }).append(link);
    }
    status.dataset.state = 'error';
    status.hidden = false;
  };

  const waLink = () => {
    const s = i18n[lang()];
    const value = digits(po.value);
    const phone = field<HTMLInputElement>('phone').value.trim();
    const email = field<HTMLInputElement>('email').value.trim();
    const commodity = s.opts[field<HTMLInputElement>('commodity').value as keyof typeof s.opts] ?? '';
    const lines = [
      s.wa1,
      `${s.po}: ${rp(value)}`,
      `${s.comm}: ${commodity}`,
      `${s.term}: ${term.value} ${s.unit}`,
      `${s.adv}: ${rp(Math.floor(value * ADVANCE_SHARE))}`,
      phone && `${s.phone}: ${phone}`,
      email && `Email: ${email}`,
      s.src,
    ].filter(Boolean);
    return `https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const s = i18n[lang()];
    const phone = field<HTMLInputElement>('phone').value.trim();
    const email = field<HTMLInputElement>('email');
    if (!digits(po.value)) return show(s.errPo), po.focus();
    if (!field<HTMLInputElement>('name').value.trim()) return show(s.errName), field<HTMLInputElement>('name').focus();
    if (!phone && !email.value.trim()) return show(s.errContact), field<HTMLInputElement>('phone').focus();
    if (email.value.trim() && !email.checkValidity()) return show(s.errEmail), email.focus();

    wa.href = waLink();
    status.hidden = true;
    const label = button.textContent;
    button.disabled = true;
    button.textContent = s.sending;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { accept: 'application/json' } });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        fields.hidden = true;
        done.hidden = false;
        done.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        return;
      }
      if (data.error === 'verification') show(s.verification);
      else show(s.server, true);
    } catch {
      show(s.server, true);
    } finally {
      button.disabled = false;
      button.textContent = label;
      (window as unknown as { turnstile?: TurnstileApi }).turnstile?.reset(form.querySelector('.cf-turnstile') ?? undefined);
    }
  });
}
