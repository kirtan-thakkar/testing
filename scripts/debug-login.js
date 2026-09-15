const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://187.77.79.40.nip.io/login');
  await page.getByRole('textbox', { name: /Email/i }).fill('dummy1@gmail.com');
  await page.getByRole('textbox', { name: /Password/i }).fill('Puffyin@7410');
  await page.getByRole('button', { name: /Log In/i }).click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'scripts/login-error.png' });
  
  await browser.close();
})();
