const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'state.json' });
  const page = await context.newPage();
  
  await page.goto('https://187.77.79.40.nip.io/start');
  console.log('Navigated to /start');
  await page.waitForTimeout(2000);
  
  const html = await page.content();
  fs.writeFileSync('start-page.html', html);
  
  const btns = await page.locator('button, a').allInnerTexts();
  console.log('Buttons/Links on /start:', btns.filter(t => t.toLowerCase().includes('start')));
  
  await browser.close();
})();
