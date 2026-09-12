const { chromium } = require('playwright');
const { loginAdmin } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch();
  const { page } = await loginAdmin(browser);
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  const html = await page.content();
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  console.log('Sidebar navigation elements:');
  $('nav, [role="navigation"]').find('a, button').each((i, el) => {
    console.log($(el).prop('tagName'), $(el).text().trim(), $(el).attr('href') || '');
  });
  
  await browser.close();
})();
