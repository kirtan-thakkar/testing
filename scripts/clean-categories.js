const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://admin.187.77.79.40.nip.io/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
  await page.getByRole('textbox', { name: 'Password' }).fill("r9Ff{A0Z'kY:{V1W");
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  
  await page.goto('https://admin.187.77.79.40.nip.io/categories', { waitUntil: 'domcontentloaded' });
  
  let deleted = 0;
  let hasMore = true;
  while (hasMore) {
    let deletedOne = false;
    await page.waitForTimeout(1500);
    const deleteBtns = page.getByRole('button', { name: /Delete .*17[89]/i });
    const count = await deleteBtns.count();
    
    if (count > 0) {
       for (let i = 0; i < count; i++) {
         try {
           await deleteBtns.nth(i).click({ force: true });
           const modal = page.locator('div[role="dialog"], dialog').filter({ hasText: /Delete/i });
           await modal.waitFor({ state: 'visible', timeout: 3000 });
           await modal.getByRole('button', { name: 'Delete' }).click({ force: true });
           await page.waitForTimeout(1000);
           deletedOne = true;
           deleted++;
           console.log('Deleted ' + deleted);
           break; // break the for loop to re-evaluate count
         } catch (e) {
           console.log('Failed to delete one, trying next...');
         }
       }
    }
    
    if (!deletedOne) {
      const nextBtn = page.getByRole('button', { name: /^Next/i });
      if (await nextBtn.isVisible() && await nextBtn.isEnabled() && !(await nextBtn.getAttribute('disabled'))) {
         await nextBtn.click();
         await page.waitForTimeout(1000);
      } else {
         hasMore = false;
      }
    }
  }
  console.log('Done! Deleted ' + deleted + ' categories.');
  await browser.close();
})();
