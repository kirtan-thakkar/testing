const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://187.77.79.40.nip.io/login');
  await page.locator('input[name="email"]').fill('dummy@gmail.com');
  await page.locator('input[name="password"]').fill('Puffyin@69');
  await page.getByRole('button', { name: 'Log In' }).click();
  try {
    await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 30000 });
    console.log('Login successful! URL:', page.url());
  } catch (e) {
    console.log('Login failed. URL:', page.url());
    console.log('HTML:', await page.locator('.text-red-500').allInnerTexts());
  }
  await browser.close();
})();
