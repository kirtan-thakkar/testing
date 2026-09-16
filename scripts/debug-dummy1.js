const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://187.77.79.40.nip.io/login');
  await page.getByRole('textbox', { name: /Email/i }).fill('dummy1@gmail.com');
  await page.getByRole('textbox', { name: /Password/i }).fill('Puffyin@7410');
  await page.getByRole('button', { name: /Log in/i }).click();
  
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  
  await page.goto('https://187.77.79.40.nip.io/start/application');
  await page.waitForTimeout(3000);
  console.log('Current URL:', page.url());
  const content = await page.content();
  if (content.includes('Company Name')) console.log('Form is visible');
  else console.log('Form is missing.');
  
  await page.screenshot({ path: 'dummy1-wizard.png' });
  
  await browser.close();
})();
