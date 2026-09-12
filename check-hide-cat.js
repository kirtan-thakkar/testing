const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch();
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  
  await page.getByRole('button', { name: /New category/i }).click();
  const name = `HideCat ${Date.now()}`;
  await page.getByLabel(/^Name/i).fill(name);
  await page.getByRole('button', { name: /Create category/i }).click();
  
  await page.waitForTimeout(2000); // Wait to appear in list
  
  const searchInput = page.getByPlaceholder(/Search name or slug/i);
  await searchInput.fill(name);
  await searchInput.press('Enter');
  await page.waitForTimeout(1000);
  
  const row = page.getByRole('row', { name }).first();
  await row.getByRole('button', { name: /^Hide$/i }).click();
  
  await page.waitForTimeout(1000);
  
  const html = await page.content();
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  console.log('Dialogs:', $('dialog, [role="dialog"], .modal').length);
  $('dialog, [role="dialog"]').each((i, el) => {
     console.log('Dialog text:', $(el).text().trim()); 
  });
  
  await browser.close();
})();
