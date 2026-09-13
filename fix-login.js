const fs = require('fs');

let content = fs.readFileSync('tests/wizard-helpers.js', 'utf8');

// Replace the buggy wait
content = content.replace(/await page\.locator\('input\[name="email"\]'\)\.waitFor\(\{ timeout: 15000 \}\);/g, 
  "await page.getByRole('textbox', { name: /Email/i }).waitFor({ timeout: 15000 });");

fs.writeFileSync('tests/wizard-helpers.js', content);
console.log('Fixed login check in wizard-helpers');
