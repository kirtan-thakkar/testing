const fs = require('fs');

const files = [
  'tests/negative/wizard-application.negative.spec.js',
  'tests/negative/wizard-step2-uploads.negative.spec.js',
  'tests/positive/wizard-application.positive.spec.js',
  'tests/positive/wizard-step2-uploads.positive.spec.js'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Remove the redundant 30s wait that causes the watchdog to fire when account is locked
    content = content.replace(/await page\.locator\('h1', \{ hasText: \/Start your campaign\/i \}\)\.first\(\)\.waitFor\(\{ timeout: \d+ \}\);/g, '');
    fs.writeFileSync(file, content);
  }
}
console.log('Removed 30s wait for h1');
