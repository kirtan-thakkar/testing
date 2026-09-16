const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://187.77.79.40.nip.io/login');
  await page.getByRole('textbox', { name: /Email/i }).fill('dummy1@gmail.com');
  await page.getByRole('textbox', { name: /Password/i }).fill('Puffyin@7410');
  await page.getByRole('button', { name: /Log in/i }).click();
  
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  console.log('Logged in to dummy1');
  
  // Go to user campaigns
  await page.goto('https://187.77.79.40.nip.io/my-campaigns', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  const content = await page.content();
  console.log('My campaigns:', await page.locator('body').innerText());
  
  // If there's a delete button, click it
  const deleteBtn = page.getByRole('button', { name: /Delete/i }).first();
  if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.waitForTimeout(1000);
      const confirm = page.getByRole('button', { name: /Delete|Confirm|Yes/i }).last();
      if (await confirm.isVisible()) {
          await confirm.click();
          console.log('Campaign deleted!');
      }
  } else {
      console.log('No delete button found on /my-campaigns');
  }
  
  await browser.close();
})();
