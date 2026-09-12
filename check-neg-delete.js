const { chromium } = require('playwright');
const { loginAdmin, ADMIN_URL } = require('./tests/admin-helpers.js');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const { page } = await loginAdmin(browser);
  await page.goto(ADMIN_URL + '/categories');
  
  // Search for "Art & Photography"
  const searchInput = page.getByPlaceholder(/Search name or slug/i);
  await searchInput.fill('Art & Photography');
  await searchInput.press('Enter');
  
  await page.waitForTimeout(1500);
  
  const row = page.getByRole('row', { name: 'Art & Photography' }).first();
  const html = await row.evaluate(node => node.outerHTML);
  console.log('Row HTML:', html);
  
  const delBtn = row.getByRole('button', { name: /Delete/i });
  console.log('Delete button exists?', await delBtn.count());
  
  if (await delBtn.count() > 0) {
      console.log('Delete disabled?', await delBtn.isDisabled());
      await delBtn.click({ force: true }).catch(e => console.log('Click error:', e.message));
      await page.waitForTimeout(1000);
      
      const cheerio = require('cheerio');
      const $ = cheerio.load(await page.content());
      console.log('Dialogs after click:', $('dialog, [role="dialog"], [role="alertdialog"], .modal').length);
      $('dialog, [role="dialog"], [role="alertdialog"]').each((i, el) => {
         console.log('Dialog text:', $(el).text().trim().substring(0, 100)); 
      });
  }
  
  await browser.close();
})();
