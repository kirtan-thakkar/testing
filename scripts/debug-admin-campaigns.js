const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://admin.187.77.79.40.nip.io/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
  await page.getByRole('textbox', { name: 'Password' }).fill("r9Ff{A0Z'kY:{V1W");
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard');
  
  await page.goto('https://admin.187.77.79.40.nip.io/campaigns', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  // Search for dummy1's campaign (or just get all)
  const rows = await page.locator('tbody tr').allTextContents();
  console.log('Campaigns:', rows);
  
  await browser.close();
})();
