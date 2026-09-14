const fs = require('fs');

let c = fs.readFileSync('tests/wizard-helpers.js', 'utf8');

c = c.replace(
  /await page\.getByRole\('textbox', \{ name: \/\^Company Name\/i \}\)[\s\r\n]*\.fill\(overrides\.companyName \?\? 'Acme Corp'\);/g,
  `const companyName = page.getByRole('textbox', { name: /^Company Name/i });
  await companyName.fill(overrides.companyName ?? 'Acme Corp');
  await companyName.blur();`
);

c = c.replace(
  /await page\.getByRole\('textbox', \{ name: \/\^Company Business Address\/i \}\)[\s\r\n]*\.fill\(overrides\.address \?\? '123 Test Street, Ahmedabad, GJ 380001'\);/g,
  `const companyAddr = page.getByRole('textbox', { name: /^Company Business Address/i });
  await companyAddr.fill(overrides.address ?? '123 Test Street, Ahmedabad, GJ 380001');
  await companyAddr.blur();`
);

c = c.replace(
  /await page\.getByRole\('textbox', \{ name: \/\^PAN Card Number\/i \}\)[\s\r\n]*\.fill\(overrides\.pan \?\? 'ABCDE1234F'\);/g,
  `const panInput = page.getByRole('textbox', { name: /^PAN Card Number/i });
  await panInput.fill(overrides.pan ?? 'ABCDE1234F');
  await panInput.blur();
  // Give auto-save a moment to finish so "Continue" button is fully active
  await page.waitForTimeout(2000);`
);

fs.writeFileSync('tests/wizard-helpers.js', c);
console.log('Fixed blur correctly');
