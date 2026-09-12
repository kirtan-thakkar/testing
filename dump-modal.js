const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  await page.waitForTimeout(2000);
  
  await page.getByRole('button', { name: /New category/i }).click();
  await page.waitForTimeout(2000);
  
  fs.writeFileSync('modal.html', await page.content());
  
  await browser.close();
})();
