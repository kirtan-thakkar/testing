const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://187.77.79.40.nip.io/login');
  await page.getByRole('textbox', { name: /Email/i }).fill('dummy1@gmail.com');
  await page.getByRole('textbox', { name: /Password/i }).fill('Puffyin@7410');
  await page.getByRole('button', { name: /Log In/i }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  
  await page.goto('https://187.77.79.40.nip.io/start/application');
  await page.waitForTimeout(5000);
  const h1s = await page.locator('h1').allTextContents();
  console.log('H1s found on /start/application:', h1s);
  await browser.close();
})();
