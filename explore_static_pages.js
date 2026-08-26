const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const urls = [
    '/',
    '/explore',
    '/how-it-works',
    '/start',
    '/about',
    '/pricing',
    '/success-stories',
    '/creators',
    '/backers',
    '/mentors',
    '/contact'
  ];
  
  const results = [];
  
  for (const path of urls) {
      const url = `https://187.77.79.40.nip.io${path}`;
      await page.goto(url);
      await page.waitForTimeout(1000);
      
      const title = await page.title();
      const h1 = await page.locator('h1').first().innerText().catch(() => 'No H1');
      const text = await page.locator('body').innerText().catch(() => '');
      
      results.push(`PATH: ${path}\nTITLE: ${title}\nH1: ${h1}\nCONTENT: ${text.substring(0, 200).replace(/\n/g, ' ')}\n---`);
      console.log(`Visited ${path}`);
  }
  
  fs.writeFileSync('static_pages_report.txt', results.join('\n'));
  console.log('Saved to static_pages_report.txt');
  
  await browser.close();
})();
