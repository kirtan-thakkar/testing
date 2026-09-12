const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch();
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  
  await page.getByRole('button', { name: /New category/i }).click();
  const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
  await newCategoryHeading.waitFor({ state: 'visible' });
  
  const formContainer = page;
  await formContainer.getByLabel(/^Name/i).fill('Test Auto Slug');
  
  await page.waitForTimeout(1000);
  const slugValue = await formContainer.getByLabel(/^Slug/i).inputValue();
  console.log('Slug value after filling Name:', slugValue);
  
  // Now explicitly clear it
  await formContainer.getByLabel(/^Slug/i).fill('');
  
  await formContainer.getByRole('button', { name: /Create category/i }).click();
  await page.waitForTimeout(1000); // Wait for error to appear
  
  const html = await page.content();
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  console.log('--- Toasts ---');
  $('.toast, [role="alert"], [class*="error"], [class*="text-red"]').each((i, el) => {
      console.log($(el).text().trim());
  });
  
  await browser.close();
})();
