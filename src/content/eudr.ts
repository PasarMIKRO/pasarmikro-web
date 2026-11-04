import { t, type Locale } from '../i18n';

/** Early-joiner offer ends at the end of 13 November 2026, Jakarta time (as on the original page). */
export const OFFER_ENDS = new Date('2026-11-13T23:59:59+07:00');

/** "Ends in 17 days" / "Berakhir dalam 17 hari", as the original countdown worded it. */
export function offerCountdown(locale: Locale, now = Date.now()) {
  const days = Math.ceil((OFFER_ENDS.getTime() - now) / 86_400_000);
  const d = t(locale).eudr;
  return days <= 1 ? d.endsToday : d.endsInDays.replace('{days}', String(days));
}
