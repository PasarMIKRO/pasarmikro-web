import { describe, expect, it } from 'vitest';
import { defaultLocale, localeFromParam, localeOfPath, localePath, localeStaticPaths, locales } from '.';

describe('i18n helpers', () => {
  it('treats the first language as the unprefixed default', () => {
    expect(defaultLocale).toBe('en');
    expect(localePath('en', '/faq/')).toBe('/faq/');
    expect(localePath('id', '/faq/')).toBe('/id/faq/');
  });

  it.each([
    [undefined, 'en'],
    ['', 'en'],
    ['id', 'id'],
    ['en', null], // the default has no prefix; /en/... is redirected instead
    ['zz', null],
  ])('localeFromParam(%j) → %j', (param, out) => {
    expect(localeFromParam(param)).toBe(out);
  });

  it.each([
    ['/id/faq/', 'id'],
    ['/id/', 'id'],
    ['/faq/', 'en'],
    ['/identity/', 'en'],
    ['/', 'en'],
  ])('localeOfPath(%s) → %s', (path, out) => {
    expect(localeOfPath(path)).toBe(out);
  });

  it('builds one static path per language', () => {
    expect(localeStaticPaths()).toHaveLength(locales.length);
  });
});
