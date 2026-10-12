const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://admin.187.77.79.40.nip.io/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
  await page.getByRole('textbox', { name: 'Password' }).fill("r9Ff{A0Z'kY:{V1W");
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard');
  
  await page.goto('https://admin.187.77.79.40.nip.io/notifications');
  await page.waitForTimeout(2000);
  require('fs').writeFileSync('notifications.html', await page.content());
  
  await browser.close();
  console.log('Saved notifications.html');
})();
