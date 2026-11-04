import { describe, expect, it } from 'vitest';
import { legacyRedirect } from './redirects';

describe('legacyRedirect', () => {
  it.each([
    ['/kebijakan-privasi/', '/id/privacy-policy/'],
    ['/kebijakan-privasi', '/id/privacy-policy/'],
    ['/kebijakan-privasi.html', '/id/privacy-policy/'],
    ['/kepatuhan-eudr/', '/id/eudr/'],
    ['/case-study-details/', '/case-studies/'],
    ['/career-details', '/career/'],
    ['/impact-dashboard/', '/impact/'],
    ['/platform-news/', '/insights/'],
    ['/terms-and-condition/', '/terms-and-conditions/'],
    ['/about.html', '/about/'],
    ['/index.html', '/'],
    ['/eudr/index.html', '/eudr/'],
    ['/en', '/'],
    ['/en/', '/'],
    ['/en/eudr/', '/eudr/'],
    ['/en/eudr', '/eudr/'],
    ['/en/about.html', '/about/'],
    ['/en/blog/', '/insights/'],
  ])('%s → %s', (from, to) => {
    expect(legacyRedirect(from)).toBe(to);
  });

  // /404 must pass through: the 404 page is rendered via a rewrite that re-runs the middleware.
  it.each(['/', '/404', '/about/', '/about', '/id/about/', '/case-studies/some-slug/', '/media/img/a.jpg'])('leaves %s alone', (p) => {
    expect(legacyRedirect(p)).toBeNull();
  });
});
