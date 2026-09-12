const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://admin.187.77.79.40.nip.io/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
  await page.getByRole('textbox', { name: 'Password' }).fill(9Ff{A0Z'kY:{V1W);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  console.log('Login successful');
  await browser.close();
})();
