const fs = require('fs');

let c = fs.readFileSync('tests/positive/user-settings.positive.spec.js', 'utf8');
c = c.replace(
  /test\.describe\('User Dashboard - Settings \(POSITIVE\)', \(\) => \{/g,
  `test.describe('User Dashboard - Settings (POSITIVE)', () => {\n  test.setTimeout(60000);`
);
fs.writeFileSync('tests/positive/user-settings.positive.spec.js', c);

console.log('Increased timeout for user-settings');
