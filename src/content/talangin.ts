import { t, type Locale } from '../i18n';
import { getImpactMetrics } from '../lib/content';

/**
 * Public impact figures shown on the Talangin pages: the same files as /impact/ and the homepage
 * (content/impact/metrics), so they update together. Only cumulative totals, per DESIGN.md "Numbers".
 */
export async function talanginProof(locale: Locale) {
  const labels = t(locale).home.kpi;
  const wanted = ['farmers', 'total_impact', 'talangin_impact'] as const;
  return (await getImpactMetrics())
    .filter((m) => (wanted as readonly string[]).includes(m.data.metric))
    .map((m) => ({
      value: typeof m.data.value === 'string' ? m.data.value : m.data.value[locale],
      unit: m.data.unit?.[locale],
      label: labels[m.data.metric],
    }));
}
