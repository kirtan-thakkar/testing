const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://admin.187.77.79.40.nip.io/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
  await page.getByRole('textbox', { name: 'Password' }).fill("r9Ff{A0Z'kY:{V1W");
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard');
  await page.goto('https://admin.187.77.79.40.nip.io/categories', { waitUntil: 'domcontentloaded' });
  const rowsDropdown = page.getByRole('combobox').filter({ hasText: /Rows per page/i }).first();
  if (await rowsDropdown.isVisible()) {
     await rowsDropdown.selectOption({ label: '50' }).catch(() => {});
     await page.waitForTimeout(1500);
  }
  const row = page.locator('tr').filter({ hasText: 'Test Category' }).first();
  const html = await row.innerHTML();
  console.log(html);
  await browser.close();
})();
