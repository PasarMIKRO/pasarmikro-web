// Checks the writing rules in content/README.md that the content schemas cannot express.
// Errors block `npm run check`; warnings are printed for the reviewer.

const BUZZWORDS = [
  'seamless',
  'revolutionary',
  'revolutionize',
  'cutting-edge',
  'game-changer',
  'game changer',
  'next-generation',
  'world-class',
  'best-in-class',
  'leverage',
  'unlock',
  'empower',
  'robust',
  'synergy',
  'innovative',
];

/** Problems in one content file. `name` is the file name, `text` its full contents. */
export function lintFile(name, text) {
  const errors = [];
  const warnings = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.md$/.test(name)) errors.push('file name: use lowercase words joined by hyphens, like ngawi-rice-traders.md');

  text.split(/\r?\n/).forEach((line, i) => {
    const at = `line ${i + 1}`;
    if (line.includes('—')) errors.push(`${at}: em dash (—); use a comma, period, colon or parentheses`);
    if (/\s–\s/.test(line)) errors.push(`${at}: spaced en dash (–) used as a dash; use a comma, period or colon`);
    const placeholder = line.match(/MISSING:|\bTODO\b|lorem ipsum|\[REAL DATA\]|\bTBD\b|XXX/i);
    if (placeholder) errors.push(`${at}: unfinished placeholder "${placeholder[0]}"`);
    for (const word of BUZZWORDS) {
      if (new RegExp(`\\b${word}`, 'i').test(line)) warnings.push(`${at}: "${word}" is on the avoid list; say what it does instead`);
    }
    if (/\p{Extended_Pictographic}/u.test(line)) warnings.push(`${at}: emoji; the site does not use emoji`);
  });
  return { errors, warnings };
}

/** For en/ and id/ folders: files that exist in one language but not the other. */
export function missingTranslations(paths) {
  const byFolder = new Map();
  for (const p of paths) {
    const m = p.match(/^(.*)\/(en|id)\/([^/]+)$/);
    if (!m) continue;
    const [, folder, lang, file] = m;
    if (!byFolder.has(folder)) byFolder.set(folder, { en: new Set(), id: new Set() });
    byFolder.get(folder)[lang].add(file);
  }
  const out = [];
  for (const [folder, { en, id }] of byFolder) {
    for (const f of en) if (!id.has(f)) out.push(`${folder}/en/${f} has no Indonesian version (${folder}/id/${f})`);
    for (const f of id) if (!en.has(f)) out.push(`${folder}/id/${f} has no English version (${folder}/en/${f})`);
  }
  return out;
}
