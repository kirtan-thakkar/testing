const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://187.77.79.40.nip.io/register');
  await page.waitForTimeout(3000);
  
  const html = await page.content();
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  $('input').each((i, el) => {
     console.log('Input:', $(el).attr('placeholder'), $(el).attr('type'), $(el).attr('name'));
  });
  
  $('button').each((i, el) => {
     console.log('Button:', $(el).text().trim());
  });
  
  await browser.close();
})();
