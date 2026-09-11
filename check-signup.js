const { chromium } = require('playwright');
const cheerio = require('cheerio');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://187.77.79.40.nip.io/register');
  const $ = cheerio.load(await page.content());
  const inputs = [];
  $('input, button').each((i, el) => {
     inputs.push($(el).attr('name') || $(el).attr('type') || $(el).text().trim());
  });
  console.log('Inputs:', inputs.join(', '));
  await browser.close();
})();
