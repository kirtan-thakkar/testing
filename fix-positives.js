const fs = require('fs');

let c = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf8');
c = c.replace(/getByLabel\(\/Active\/i\)/g, "getByRole('checkbox', { name: /Active/i })");
fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', c);

c = fs.readFileSync('tests/positive/user-settings.positive.spec.js', 'utf8');
c = c.replace(/getByRole\('link', \{ name: \/Settings\/i \}\)/g, "getByText('Settings', { exact: true })");
fs.writeFileSync('tests/positive/user-settings.positive.spec.js', c);

c = fs.readFileSync('tests/wizard-helpers.js', 'utf8');
c = c.replace(/getByRole\('link', \{ name: \/Settings\/i \}\)/g, "getByText('Settings', { exact: true })");
fs.writeFileSync('tests/wizard-helpers.js', c);

c = fs.readFileSync('tests/positive/wizard-application.positive.spec.js', 'utf8');
c = c.replace(/await page\.getByRole\('textbox', \{ name: \/\^Company Name\/i \}\)\.fill\('Refresh Corp'\);/g, "await page.getByRole('textbox', { name: /^Company Name/i }).fill('Refresh Corp');\n    await page.waitForTimeout(2000); // Wait for auto-save");
fs.writeFileSync('tests/positive/wizard-application.positive.spec.js', c);
