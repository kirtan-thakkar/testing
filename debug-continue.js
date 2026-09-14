const { chromium } = require('@playwright/test');
const { login, dismissCookies, fillStep1 } = require('./tests/wizard-helpers.js');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await login(page);
  await page.goto('https://187.77.79.40.nip.io/start/application');
  await dismissCookies(page);
  await fillStep1(page);
  
  console.log('Filled step 1. Clicking Continue...');
  const contBtn = page.getByRole('button', { name: /^Continue/i }).first();
  await contBtn.click();
  
  console.log('Clicked Continue. Waiting 3 seconds...');
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'step1-after-continue.png', fullPage: true });
  console.log('Saved screenshot step1-after-continue.png');
  
  const h1 = await page.locator('h1').textContent();
  const step2 = await page.getByText(/Step 2 of 4/i).isVisible();
  console.log('H1:', h1);
  console.log('Is Step 2 visible?', step2);
  
  await browser.close();
})();
