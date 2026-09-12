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
  await formContainer.getByLabel(/^Name/i).fill('Test Invalid Slug Name');
  
  // Fill invalid slug
  await formContainer.getByLabel(/^Slug/i).fill('Invalid Slug!@#');
  
  await formContainer.getByRole('button', { name: /Create category/i }).click();
  await page.waitForTimeout(1500); // Wait for error to appear
  
  // Dump text around Slug to see if there is an inline error
  const html = await page.content();
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  console.log('--- Slug input value ---');
  console.log($('label:contains("Slug")').next('input').val());
  
  console.log('--- Toasts / Alerts ---');
  $('.toast, [role="alert"], [class*="error"], [class*="text-red"]').each((i, el) => {
      console.log($(el).text().trim());
  });
  
  await browser.close();
})();
