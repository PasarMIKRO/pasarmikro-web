import { t, type Locale } from '../i18n';
import { getImpactMetrics } from '../lib/content';

/**
 * Public platform figures on the embedded insurance page: the same files as /impact/ and the homepage
 * (content/impact/metrics), so they update together. Only cumulative totals, per DESIGN.md "Numbers".
 */
export async function insuranceProof(locale: Locale) {
  const labels = t(locale).home.kpi;
  const wanted = ['farmers', 'total_impact', 'women'] as const;
  const metrics = await getImpactMetrics();
  return wanted.flatMap((name) =>
    metrics
      .filter((m) => m.data.metric === name)
      .map((m) => ({
        value: typeof m.data.value === 'string' ? m.data.value : m.data.value[locale],
        unit: m.data.unit?.[locale],
        label: labels[name],
      })),
  );
}
