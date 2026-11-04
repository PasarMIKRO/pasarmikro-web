import { describe, expect, it } from 'vitest';
import { lintFile, missingTranslations } from './content-lint.mjs';

describe('lintFile', () => {
  it('passes clean content', () => {
    expect(lintFile('ngawi-rice.md', '---\ntitle: Ngawi rice\n---\n\nCollectors record each purchase.')).toEqual({ errors: [], warnings: [] });
  });
  it.each([
    ['em dash', 'Fast — and fair.', 'em dash'],
    ['spaced en dash', 'Fast – and fair.', 'en dash'],
    ['AI placeholder', 'value: MISSING: trade value', 'MISSING:'],
    ['lorem ipsum', 'Lorem ipsum dolor', 'placeholder "Lorem ipsum"'],
    ['TODO', 'TODO add results', 'TODO'],
  ])('flags %s as an error', (_, line, expected) => {
    expect(lintFile('a.md', line).errors.join()).toContain(expected);
  });
  it('flags bad file names', () => {
    expect(lintFile('Ngawi Rice.md', '').errors[0]).toContain('file name');
    expect(lintFile('2026_ngawi.md', '').errors[0]).toContain('file name');
  });
  it('warns on buzzwords and emoji without failing', () => {
    const r = lintFile('a.md', 'A seamless, innovative platform 🚀');
    expect(r.errors).toEqual([]);
    expect(r.warnings.join()).toContain('seamless');
    expect(r.warnings.join()).toContain('emoji');
  });
  it('allows en dashes in number ranges', () => {
    expect(lintFile('a.md', 'From 2020–2026.').errors).toEqual([]);
  });
});

describe('missingTranslations', () => {
  it('reports one-language files in en/id folders only', () => {
    expect(missingTranslations(['posts/en/a.md', 'posts/id/a.md', 'posts/en/b.md', 'faq/id/c.md', 'slides/x.md'])).toEqual([
      'posts/en/b.md has no Indonesian version (posts/id/b.md)',
      'faq/id/c.md has no English version (faq/en/c.md)',
    ]);
  });
});
