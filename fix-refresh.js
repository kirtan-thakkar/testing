const fs = require('fs');

let c = fs.readFileSync('tests/positive/wizard-application.positive.spec.js', 'utf8');

c = c.replace(
  /await companyInput\.fill\('Refresh Corp'\);\n\s*await companyInput\.blur\(\);\n\s*await page\.waitForTimeout\(2000\);/g,
  `const req = page.waitForResponse(res => res.url().includes('/api/') && [200, 201].includes(res.status()), { timeout: 15000 }).catch(() => {});
      await companyInput.fill('Refresh Corp');
      await companyInput.blur();
      await req;
      await page.waitForTimeout(1000); // give state a moment`
);

fs.writeFileSync('tests/positive/wizard-application.positive.spec.js', c);
console.log('Fixed mid-fill refresh test');
