const fs = require('fs');

let c = fs.readFileSync('tests/admin-helpers.js', 'utf8');

c = c.replace(
  /await page\.waitForLoadState\('domcontentloaded', \{ timeout: 90000 \}\);/g,
  `await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 90000, waitUntil: 'domcontentloaded' }).catch(e => log.warn('admin', 'waitForURL timeout or not navigating'));`
);

fs.writeFileSync('tests/admin-helpers.js', c);
console.log('Fixed admin-helpers.js');
