const fs = require('fs');

let c = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf8');
c = c.replace(
  /test\.afterAll\(async \(\) => \{\n\s*if \(page\) await page\.close\(\);\n\s*\}\);\n/g,
  ''
);
fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', c);

console.log('Removed duplicate afterAll');
