const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to login...');
  await page.goto('https://187.77.79.40.nip.io/login');
  
  console.log('Logging in...');
  await page.getByRole('textbox', { name: /Email/i }).fill('dummy@gmail.com');
  await page.getByRole('textbox', { name: /Password/i }).fill('Puffyin@7410');
  await page.getByRole('button', { name: /Log In/i }).click();
  
  await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 20000 });
  console.log('Logged in. Navigating to wizard...');
  
  await page.goto('https://187.77.79.40.nip.io/start/application', { waitUntil: 'domcontentloaded' });
  
  // Wait for the main container or 10 seconds
  await page.waitForTimeout(10000);
  
  console.log('Dumping HTML...');
  const html = await page.evaluate(() => document.body.innerHTML);
  require('fs').writeFileSync('wizard-dump.html', html);
  
  console.log('Done.');
  await browser.close();
})();
