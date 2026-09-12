const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  
  const searchInput = page.getByPlaceholder(/Search name or slug/i);
  await searchInput.fill('Art & Photography');
  await searchInput.press('Enter');
  
  await page.waitForTimeout(1500);
  
  const row = page.getByRole('row', { name: 'Art & Photography' }).first();
  await row.getByRole('button', { name: /Delete/i }).click();
  
  await page.waitForTimeout(1000);
  
  const html = await page.content();
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  $('dialog, [role="dialog"], [role="alertdialog"], .modal').each((i, el) => {
     console.log('--- DIALOG ---');
     console.log($(el).text().trim());
  });
  
  await browser.close();
})();
