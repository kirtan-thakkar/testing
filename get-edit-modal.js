const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch();
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  
  // Find a category row, e.g. "Software"
  const row = page.getByRole('row', { name: /Software/i }).first();
  await row.getByRole('button', { name: /Edit/i }).click();
  
  const heading = page.getByRole('heading', { name: /Edit Category/i });
  // Wait a bit for the form to appear
  await page.waitForTimeout(2000);
  
  const html = await page.content();
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  console.log('Heading:', $('h2').text().trim());
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
