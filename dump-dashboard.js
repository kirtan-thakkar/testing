const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://187.77.79.40.nip.io/login');
  
  await page.getByRole('textbox', { name: /Email/i }).fill('dummy@gmail.com');
  await page.getByRole('textbox', { name: /Password/i }).fill('Puffyin@7410');
  await page.getByRole('button', { name: /Log In/i }).click();
  
  await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 20000 });
  await page.goto('https://187.77.79.40.nip.io/dashboard', { waitUntil: 'domcontentloaded' });
  
  await page.waitForTimeout(5000);
  
  const html = await page.evaluate(() => document.body.innerHTML);
  require('fs').writeFileSync('dashboard-dump.html', html);
  
  await browser.close();
})();
