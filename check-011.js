const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  
  await page.getByRole('button', { name: /New category/i }).click();
  
  const uniqueName = `CancelHide Cat ${Date.now()}`;
  await page.getByLabel(/^Name/i).fill(uniqueName);
  await page.getByRole('button', { name: /Create category/i }).click();
  await page.waitForTimeout(2000);
  
  const searchInput = page.getByPlaceholder(/Search name or slug/i);
  await searchInput.fill(uniqueName);
  await searchInput.press('Enter');
  
  await page.waitForTimeout(1000);
  
  const row = page.getByRole('row', { name: uniqueName }).first();
  await row.getByRole('button', { name: /^Hide$/i }).click();
  
  await page.waitForTimeout(1000);
  
  const html = await page.content();
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  console.log('Row text after Hide:', row ? await row.innerText() : 'row not found');
  
  await browser.close();
})();
