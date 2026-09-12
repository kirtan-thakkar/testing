const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch();
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  await page.waitForTimeout(2000);
  
  await page.getByRole('button', { name: /New category/i }).click();
  await page.waitForTimeout(2000);
  
  const cheerio = require('cheerio');
  const $ = cheerio.load(await page.content());
  
  console.log('Dialog Heading:', $('[role="dialog"] h2').text().trim() || $('h2').text().trim());
  $('input, select, textarea, button').each((i, el) => {
    let type = $(el).attr('type') || '';
    let name = $(el).attr('name') || '';
    let text = $(el).text().trim();
    let id = $(el).attr('id') || '';
    let label = $('label[for="' + id + '"]').text().trim();
    if (!label) label = $(el).closest('label').text().trim();
    if (!label) label = $(el).attr('aria-label') || '';
    console.log(`- ${$(el).prop('tagName')} [type=${type}] [name=${name}] [id=${id}] [label=${label}] text: ${text}`);
  });
  
  await browser.close();
})();
