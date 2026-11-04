// Usage: node scripts/check-content.mjs  (part of `npm run check`)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { lintFile, missingTranslations } from './content-lint.mjs';

const root = 'content';
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

// Rules, templates and this guide start with "_" or are README files; the site ignores them too.
const files = walk(root)
  .filter((p) => p.endsWith('.md'))
  .map((p) => relative(root, p).replaceAll('\\', '/'))
  .filter((p) => !p.split('/').pop().startsWith('_') && !p.endsWith('README.md'));

let errorCount = 0;
for (const file of files) {
  const { errors, warnings } = lintFile(file.split('/').pop(), readFileSync(join(root, file), 'utf8'));
  for (const e of errors) console.log(`ERROR   content/${file}: ${e}`);
  for (const w of warnings) console.log(`warning content/${file}: ${w}`);
  errorCount += errors.length;
}
for (const w of missingTranslations(files)) console.log(`warning content/${w}`);

console.log(errorCount ? `\n${errorCount} problem(s) to fix in content/.` : `Content rules: ${files.length} file(s) OK.`);
process.exit(errorCount ? 1 : 0);
