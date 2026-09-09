const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname);
const TESTS_DIR = path.join(ROOT);
const OUT_MD = path.join(ROOT, '..', 'TEST_CATALOG.md');
const OUT_JSON = path.join(ROOT, 'TEST_CATALOG.json');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

const specs = walkSync(TESTS_DIR)
  .filter(f => f.endsWith('.spec.js') && !f.includes('SKIPPED'))
  .sort();

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

const byPrefix = {};
catalog.forEach(e => e.tests.forEach(t => {
  const m = t.match(/^(UF-[A-Z]+-\d+)/);
  const k = m ? m[1] : 'MISC';
  (byPrefix[k] = byPrefix[k] || []).push([e.file, t]);
}));

const total = catalog.reduce((s, c) => s + c.count, 0);
console.log('wrote ' + OUT_JSON + ' tests: ' + total);
