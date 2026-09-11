const { chromium } = require('playwright');
const cheerio = require('cheerio');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://187.77.79.40.nip.io/register');
  const $ = cheerio.load(await page.content());
  $('input').each((i, el) => {
     console.log('INPUT:', $(el).attr('name'), $(el).attr('id'), $(el).attr('placeholder'), $(el).attr('type'));
  });
  await browser.close();
})();
