const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://187.77.79.40.nip.io/login');
  await page.locator('input[name="email"]').fill('dummy@gmail.com');
  await page.locator('input[name="password"]').fill('Puffyin@69');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'login-error.png' });
  await browser.close();
})();
