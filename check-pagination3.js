const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  
  await page.waitForTimeout(1000);
  
  const html = await page.content();
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  $('a, button').each((i, el) => {
     const text = $(el).text().trim();
     if (text.includes('Prev') || text.includes('Next')) {
         console.log('Element:', el.tagName, 'text:', text, 'role:', $(el).attr('role'), 'disabled:', $(el).attr('disabled'));
     }
  });
  
  await browser.close();
})();
