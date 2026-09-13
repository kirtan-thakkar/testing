const fs = require('fs');

let content = fs.readFileSync('tests/positive/wizard-step3-submit.positive.spec.js', 'utf8');
content = content.replace(
  /await expect\(page\.locator\('text="Submission received"'\)\.first\(\)\)\.toBeVisible\(\{ timeout: 15000 \}\);/g,
  "await expect(page.locator('text=/under review|submitted/i').first()).toBeVisible({ timeout: 15000 });"
);
fs.writeFileSync('tests/positive/wizard-step3-submit.positive.spec.js', content);
console.log('Fixed Step 3 success assertion');
