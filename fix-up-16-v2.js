const fs = require('fs');

let c = fs.readFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', 'utf8');

c = c.replace(
  /const coverInput = page\.locator\('input\[type=file\]\[accept\*="image"\]'\)\.first\(\);\s*await coverInput\.setInputFiles\(IMG_SMALL\);\s*await page\.waitForTimeout\(2000\);\s*await page\.locator\('button'\)\.filter\(\{ hasText: \/\^Continue\/i \}\)\.first\(\)\.click\(\{ force: true \}\);/g,
  `await page.locator('button').filter({ hasText: /^Continue/i }).first().click({ force: true });
    await page.waitForTimeout(2000);
    const coverInput = page.locator('input[type=file][accept*="image"]').first();
    await coverInput.setInputFiles(IMG_SMALL);`
);

fs.writeFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', c);
console.log('Fixed UP-16-P');
