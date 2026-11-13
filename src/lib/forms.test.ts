import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  applicationRecord,
  applySchema,
  bodyTooLarge,
  contactRecord,
  contactSchema,
  CV_MAX_BYTES,
  hasCvSignature,
  isValidCv,
  safeReturnPath,
} from './forms';

const base = { locale: 'en', name: 'Test Person', email: 'person@example.com' };

describe('contactSchema', () => {
  it('accepts a contact message and blanks empty optionals', () => {
    const r = contactSchema.parse({ ...base, source: 'contact', message: 'Hello', company: '', phone: '' });
    expect(r).toMatchObject({ company: null, phone: null });
  });

  it('accepts an EUDR sign-up', () => {
    expect(contactSchema.safeParse({ ...base, source: 'eudr', company: 'Kopi Co', commodity: 'cocoa', role: 'exporter' }).success).toBe(true);
  });

  it.each([
    ['missing message', { ...base, source: 'contact' }],
    ['bad email', { ...base, source: 'contact', message: 'Hi', email: 'nope' }],
    ['EUDR without company', { ...base, source: 'eudr', commodity: 'coffee', role: 'exporter' }],
    ['unknown commodity', { ...base, source: 'eudr', company: 'X', commodity: 'tea', role: 'exporter' }],
    ['unknown source', { ...base, source: 'admin', message: 'Hi' }],
    ['unknown locale', { ...base, source: 'contact', message: 'Hi', locale: 'fr' }],
  ])('rejects %s', (_, input) => {
    expect(contactSchema.safeParse(input).success).toBe(false);
  });
});

describe('safeReturnPath', () => {
  it.each([
    ['/contact/', '/contact/'],
    ['/id/eudr/', '/id/eudr/'],
    ['//evil.com/', '/'],
    ['https://evil.com/', '/'],
    [null, '/'],
  ])('%s → %s', (input, out) => {
    expect(safeReturnPath(input)).toBe(out);
  });
});

// Every endpoint or page that accepts form posts must check Turnstile first.
describe('write handlers', () => {
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => (statSync(join(dir, f)).isDirectory() ? files(join(dir, f)) : [join(dir, f)]));
  const writers = files('src/pages').filter((file) =>
    /export const (POST|PUT|PATCH|DELETE)\b|request\.method === 'POST'/.test(readFileSync(file, 'utf8')),
  );

  it('finds the known write handlers', () => {
    expect(writers.length).toBeGreaterThanOrEqual(2); // api/contact, api/apply
  });
  it.each(writers)('%s verifies Turnstile', (file) => {
    expect(readFileSync(file, 'utf8')).toContain('verifyTurnstile(');
  });
});

describe('contactRecord', () => {
  it('saves a contact message to the contact table without empty cells', () => {
    const r = contactRecord(contactSchema.parse({ ...base, source: 'contact', message: 'Hello', company: '', phone: '' }));
    expect(r).toEqual({ table: 'contact', fields: { Name: 'Test Person', Email: 'person@example.com', Language: 'English', Message: 'Hello' } });
  });
  it('saves an EUDR sign-up with English option labels, whatever the page language', () => {
    const input = { ...base, locale: 'id', source: 'eudr', company: 'Kopi Co', commodity: 'both', role: 'eu-buyer', phone: '0812' };
    expect(contactRecord(contactSchema.parse(input))).toEqual({
      table: 'eudr',
      fields: { Name: 'Test Person', Email: 'person@example.com', Phone: '0812', Language: 'Bahasa Indonesia', Company: 'Kopi Co', Commodity: 'Both', Role: 'EU buyer' },
    });
  });
});

describe('applySchema and applicationRecord', () => {
  const ok = { roleSlug: 'field-officer', locale: 'id', name: 'Ani', email: 'ani@example.com' };
  it('accepts a minimal application and leaves empty cells out', () => {
    const app = applySchema.parse({ ...ok, phone: '', linkedinUrl: '', message: '' });
    expect(applicationRecord(app, 'Field Officer')).toEqual({ Name: 'Ani', Role: 'Field Officer', Email: 'ani@example.com', Language: 'Bahasa Indonesia' });
  });
  it('only accepts https LinkedIn links', () => {
    expect(applySchema.safeParse({ ...ok, linkedinUrl: 'javascript:alert(1)' }).success).toBe(false);
  });
});

describe('isValidCv', () => {
  const file = (name: string, bytes: number) => new File([new Uint8Array(bytes)], name);
  it.each(['cv.pdf', 'CV.PDF', 'cv.doc', 'cv.docx'])('accepts %s', (name) => {
    expect(isValidCv(file(name, 1000))).toBe(true);
  });
  it.each([
    ['an empty file', file('cv.pdf', 0)],
    ['a file over 5 MB', file('cv.pdf', CV_MAX_BYTES + 1)],
    ['an executable', file('cv.pdf.exe', 1000)],
    ['an image', file('cv.png', 1000)],
    ['a link instead of a file', 'https://drive.google.com/x'],
    ['nothing', null],
  ])('rejects %s', (_, value) => {
    expect(isValidCv(value)).toBe(false);
  });
});

describe('hasCvSignature', () => {
  const file = (name: string, head: number[] | string) =>
    new File([typeof head === 'string' ? new TextEncoder().encode(head) : new Uint8Array([...head, ...new Array(200).fill(0)])], name);
  it.each([
    ['a PDF', file('cv.pdf', '%PDF-1.7\n...')],
    ['a PDF with bytes before its header', file('cv.pdf', '﻿\n%PDF-1.4\n...')],
    ['a DOCX', file('cv.docx', [0x50, 0x4b, 0x03, 0x04])],
    ['a DOC', file('CV.DOC', [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])],
  ])('accepts %s', async (_, f) => {
    expect(await hasCvSignature(f)).toBe(true);
  });
  it.each([
    ['a program renamed to .pdf', file('cv.pdf', [0x4d, 0x5a, 0x90, 0x00])],
    ['a PDF renamed to .docx', file('cv.docx', '%PDF-1.7')],
    ['a zip renamed to .doc', file('cv.doc', [0x50, 0x4b, 0x03, 0x04])],
    ['an empty-content file', file('cv.pdf', [0, 0, 0, 0])],
  ])('rejects %s', async (_, f) => {
    expect(await hasCvSignature(f)).toBe(false);
  });
});

describe('bodyTooLarge', () => {
  const post = (length?: string) => new Request('https://example.com/api/contact', { method: 'POST', headers: length ? { 'content-length': length } : {} });
  it.each([
    ['a post within the limit', '1000', false],
    ['a post at the limit', '2000', false],
    ['a post over the limit', '2001', true],
    ['a post with no size', undefined, true],
    ['a post with a bogus size', 'abc', true],
  ])('%s', (_, length, tooLarge) => {
    expect(bodyTooLarge(post(length), 2000)).toBe(tooLarge);
  });
});

describe('formula answers', () => {
  it('saves answers that a spreadsheet would run as plain text, and leaves phone numbers alone', () => {
    const input = { ...base, source: 'contact', message: '=HYPERLINK("https://evil.example","x")', company: '@SUM(A1)', phone: '+62 812 3456' };
    expect(contactRecord(contactSchema.parse(input)).fields).toMatchObject({
      Message: `'=HYPERLINK("https://evil.example","x")`,
      Company: "'@SUM(A1)",
      Phone: '+62 812 3456',
    });
  });
});
