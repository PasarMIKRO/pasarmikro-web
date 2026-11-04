import { describe, expect, it } from 'vitest';
import { cookieLocale, preferredPath } from './lang-pref';

describe('cookieLocale', () => {
  it.each([
    ['lang=id', 'id'],
    ['a=1; lang=en; b=2', 'en'],
    ['xlang=id', null],
    ['lang=zz', null],
    [null, null],
  ])('%j → %j', (header, out) => {
    expect(cookieLocale(header)).toBe(out);
  });
});

describe('preferredPath', () => {
  it.each([
    ['/', 'lang=id', '/id/'],
    ['/eudr/', 'lang=id', '/id/eudr/'],
    ['/insights/some-post/', 'theme=x; lang=id', '/id/insights/some-post/'],
    ['/eudr/', 'lang=en', null], // the default language is the plain URL already
    ['/eudr/', null, null],
    ['/id/eudr/', 'lang=id', null], // already the Indonesian page
    ['/en/eudr/', 'lang=id', null], // redirects to /eudr/ first
    ['/blog/', 'lang=id', null], // old URL: redirects first
    ['/eudr', 'lang=id', null], // gets its trailing slash first
    ['/api/contact', 'lang=id', null],
    ['/_astro/app.css', 'lang=id', null],
    ['/robots.txt', 'lang=id', null],
  ])('%s with %j → %j', (path, cookie, out) => {
    expect(preferredPath(path, cookie)).toBe(out);
  });
});
