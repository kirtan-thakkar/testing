const fs = require('fs');

let c = fs.readFileSync('tests/negative/wizard-step2-uploads.negative.spec.js', 'utf8');
c = c.replace(
  /await page\.locator\('button'\)\.filter\(\{ hasText: \/\^Continue\/i \}\)\.first\(\)\.click\(\{ force: true \}\);\r?\n\s*await page\.waitForTimeout\(2000\);/g,
  `const contBtn = page.getByRole('button', { name: /^Continue/i }).first();
      await contBtn.scrollIntoViewIfNeeded();
      await expect(contBtn).toBeEnabled();
      await contBtn.click();
      await expect(page.getByText(/Step 2 of 4/i)).toBeVisible({ timeout: 15000 });`
);
fs.writeFileSync('tests/negative/wizard-step2-uploads.negative.spec.js', c);

console.log('Added Step 2 wait');
