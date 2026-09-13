const fs = require('fs');

const adminFiles = [
  'tests/negative/admin-content.negative.spec.js',
  'tests/negative/admin-engagement.negative.spec.js',
  'tests/negative/admin-finance.negative.spec.js',
  'tests/negative/admin-people.negative.spec.js',
  'tests/negative/admin-system.negative.spec.js'
];

for (const file of adminFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the count() === 0 pattern with a try/catch waitFor
    content = content.replace(
      /if \(await (.*?)\.count\(\) === 0\) \{ test\.skip\(true, '(.*?)'\); return; \}/g,
      `try { await $1.waitFor({ state: 'visible', timeout: 5000 }); } catch { test.skip(true, '$2'); return; }`
    );
    
    fs.writeFileSync(file, content);
  }
}
console.log('Fixed admin safe UI checks');
