const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/campaigns');
  
  await page.waitForTimeout(1000);
  
  // Find the label containing "Rows per page"
  const combo = page.getByRole('combobox', { name: /Rows per page/i });
  if (await combo.count() > 0) {
      const parent = combo.locator('..').locator('..');
      console.log('Pagination area:', await parent.innerText());
  }
  
  await browser.close();
})();
