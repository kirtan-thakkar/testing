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
  await formContainer.getByLabel(/^Slug/i).fill('test-slug-123');
  await formContainer.getByRole('button', { name: /Create category/i }).click();
  
  await page.waitForTimeout(1000);
  const html = await page.content();
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  // Dump text around Name input to see validation message
  console.log($('label:contains("Name")').parent().text());
  console.log($('label:contains("Slug")').parent().text());
  
  await browser.close();
})();
