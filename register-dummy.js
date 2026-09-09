const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://187.77.79.40.nip.io/signup');
  await page.getByRole('textbox', { name: 'First Name' }).fill('Dummy');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('User');
  await page.getByRole('textbox', { name: 'Email' }).fill('dummy200@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Puffyin@69');
  await page.getByRole('button', { name: 'Sign Up' }).click();
  await page.waitForTimeout(5000);
  console.log('URL after signup:', page.url());
  await browser.close();
})();
