const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://187.77.79.40.nip.io/login');
  await page.locator('input[name="email"]').fill('dummy@gmail.com');
  await page.locator('input[name="password"]').fill('Puffyin@69');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(5000);
  console.log('URL:', page.url());
  const error = await page.locator('.text-red-500, .error, [role="alert"]').allInnerTexts();
  console.log('Errors:', error);
  await browser.close();
})();
