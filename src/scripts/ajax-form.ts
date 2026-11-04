// Shared by the contact, EUDR and job application forms.
// Submit in place so the visitor keeps their answers if something fails.
type TurnstileApi = { reset: (el?: Element) => void };

for (const form of document.querySelectorAll<HTMLFormElement>('[data-ajax-form]')) {
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const errors = JSON.parse(form.dataset.errors ?? '{}') as Record<string, string>;
  const sentText = form.querySelector('template[data-sent-text]')?.innerHTML ?? '';
  const label = button.textContent;

  // Each page styles [data-state=ok|error] its own way (Tailwind variants, or plain CSS on the EUDR page).
  const show = (text: string, ok: boolean) => {
    status.textContent = text;
    status.dataset.state = ok ? 'ok' : 'error';
    status.hidden = false;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    button.disabled = true;
    button.textContent = form.dataset.sending ?? label;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { accept: 'application/json' } });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        form.reset();
        show(sentText, true);
      } else {
        show(errors[data.error ?? 'server'] ?? errors.server, false);
      }
    } catch {
      show(errors.network, false);
    } finally {
      button.disabled = false;
      button.textContent = label;
      // A Turnstile token is single-use, so get a fresh one for the next attempt.
      (window as unknown as { turnstile?: TurnstileApi }).turnstile?.reset(form.querySelector('.cf-turnstile') ?? undefined);
    }
  });
}
