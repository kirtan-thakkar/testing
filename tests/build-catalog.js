#!/usr/bin/env node
/**
 * Regenerates TEST_CATALOG.md and TEST_CATALOG.json from tests/*.spec.js
 * Run:  node tests/build-catalog.js
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname);
const TESTS_DIR = path.join(ROOT);
const OUT_MD = path.join(ROOT, '..', 'TEST_CATALOG.md');
const OUT_JSON = path.join(ROOT, 'TEST_CATALOG.json');

const specs = fs.readdirSync(TESTS_DIR)
  .filter(f => f.endsWith('.spec.js') && !f.includes('SKIPPED'))
  .sort()
  .map(f => path.join(TESTS_DIR, f));

const testRe = /\btest\s*\(\s*['"]([^'"]+)['"]/g;
const describeRe = /test\.describe\(\s*['"]([^'"]+)['"]/;

const catalog = specs.map(s => {
  const c = fs.readFileSync(s, 'utf8');
  const rel = path.relative(path.join(ROOT, '..'), s);
  const desc = (c.match(describeRe) || [])[1] || '(no describe)';
  const tests = [...c.matchAll(testRe)].map(m => m[1]);
  return { file: rel, describe: desc, tests, count: tests.length };
});

fs.writeFileSync(OUT_JSON, JSON.stringify(catalog, null, 2));

// Group by UF- prefix
const byPrefix = {};
catalog.forEach(e => e.tests.forEach(t => {
  const m = t.match(/^(UF-[A-Z]+-\d+)/);
  const k = m ? m[1] : 'MISC';
  (byPrefix[k] = byPrefix[k] || []).push([e.file, t]);
}));

const areas = {
  'AUTH & Account': ['UF-AUTH', 'UF-ACCT', 'UF-DASH'],
  'Campaign Creation & Details': ['UF-CREA', 'UF-CAMP', 'UF-BACK'],
  'Wizard (Application)': ['UF-WIZ'],
  'Admin Panel': ['UF-ADMIN'],
  'Performance / Stress / Load': ['UF-PERF', 'UF-STRESS', 'UF-LOAD'],
};

const total = catalog.reduce((s, c) => s + c.count, 0);
const lines = [
  '# IdeaKicks Test Catalog', '',
  `**${catalog.length} spec files · ${total} active tests**`, '',
  'Re-generate with: `node tests/build-catalog.js`', '',
  '## Index', '',
];
for (const [area, prefs] of Object.entries(areas)) {
  const matching = Object.keys(byPrefix).filter(k => prefs.some(p => k.startsWith(p)));
  if (matching.length) {
    const n = matching.reduce((s, k) => s + byPrefix[k].length, 0);
    lines.push(`- **${area}** — ${matching.length} test groups, ${n} tests`);
  }
}
lines.push('', '---', '');

for (const [area, prefs] of Object.entries(areas)) {
  const matching = Object.keys(byPrefix).filter(k => prefs.some(p => k.startsWith(p)));
  if (!matching.length) continue;
  lines.push(`## ${area}\n`);
  for (const k of matching.sort()) {
    lines.push(`### ${k} (${byPrefix[k].length} test${byPrefix[k].length === 1 ? '' : 's'})\n`);
    for (const [f, t] of byPrefix[k]) lines.push(`- ${t}  \`${f}\``);
    lines.push('');
  }
}

lines.push('---', '', '## Summary by Spec File', '',
  '| Spec file | Describe | Tests |',
  '|-----------|----------|-------|');
catalog.forEach(c => lines.push(`| \`${c.file}\` | ${c.describe} | ${c.count} |`));

fs.writeFileSync(OUT_MD, lines.join('\n'));
console.log(`wrote ${OUT_MD}: ${total} tests in ${catalog.length} files`);
console.log(`wrote ${OUT_JSON}`);
