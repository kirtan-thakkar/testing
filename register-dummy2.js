const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://187.77.79.40.nip.io/signup');
  await page.locator('input[name="firstName"], input[placeholder*="First"]').fill('Dummy');
  await page.locator('input[name="lastName"], input[placeholder*="Last"]').fill('User');
  await page.locator('input[name="email"]').fill('dummy300@gmail.com');
  await page.locator('input[name="password"]').fill('Puffyin@69');
  await page.getByRole('button', { name: /Sign Up|Register|Create Account/i }).click();
  await page.waitForTimeout(5000);
  console.log('URL after signup:', page.url());
  await browser.close();
})();
