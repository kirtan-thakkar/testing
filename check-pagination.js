const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  
  await page.waitForTimeout(1000);
  
  const text = await page.getByText(/1-\d+ of \d+/i).or(page.getByText(/0 of 0/i)).innerText().catch(e => 'unknown');
  console.log('Pagination text:', text);
  
  // See dropdown options
  const select = page.getByRole('combobox', { name: /Rows per page/i });
  if (await select.count() > 0) {
      console.log('Options:', await select.innerText());
  }
  
  await browser.close();
})();
