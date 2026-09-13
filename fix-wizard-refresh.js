const fs = require('fs');

let c = fs.readFileSync('tests/positive/wizard-application.positive.spec.js', 'utf8');

c = c.replace(
  /await page\.getByRole\('textbox', \{ name: \/\^Company Name\/i \}\)\.fill\('Refresh Corp'\);\n\s*await page\.waitForTimeout\(2000\); \/\/ Wait for auto-save\n\s*await page\.reload\(\{ waitUntil: 'domcontentloaded' \}\);/g,
  `const companyInput = page.getByRole('textbox', { name: /^Company Name/i });\n    await companyInput.fill('Refresh Corp');\n    await companyInput.blur();\n    await page.waitForTimeout(2000);\n    await page.reload({ waitUntil: 'domcontentloaded' });`
);

fs.writeFileSync('tests/positive/wizard-application.positive.spec.js', c);
console.log('Fixed wizard refresh');
