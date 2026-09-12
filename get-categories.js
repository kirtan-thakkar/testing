const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'categories.png', fullPage: true });
  const html = await page.content();
  fs.writeFileSync('categories.html', html);
  
  await browser.close();
})();
