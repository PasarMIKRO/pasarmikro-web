// GA4 conversion events. gtag comes from SeoHead; without it (blocked or offline) these do nothing.
type Gtag = (...args: unknown[]) => void;

/** Tell GA4 a lead came in (its recommended "generate_lead" event), named by the form's source field. */
export function trackLead(form: HTMLFormElement) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  const source = (form.elements.namedItem('source') as unknown as { value?: string } | null)?.value ?? 'form';
  gtag?.('event', 'generate_lead', { form: source, page_path: location.pathname });
}
