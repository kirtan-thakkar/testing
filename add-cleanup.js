const fs = require('fs');
let content = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf-8');

const cleanupCode = `
  test.afterAll(async ({ browser }) => {
    // Global cleanup for any left-over categories from this suite
    // Note: loginAdmin is already imported via global setup, but admin tests might have their own page.
    // Let's just create a new page context
    const context = await browser.newContext({ storageState: 'state-admin.json' });
    const page = await context.newPage();
    const { ADMIN_URL } = require('../admin-helpers.js');
    await page.goto(ADMIN_URL + '/categories');
    
    const prefixes = ['New Cat', 'Child Cat', 'SortCat', 'Icon Cat', 'Inactive Cat', 'EditCat', 'CancelEdit', 'ToHide Cat', 'CancelHide Cat', 'CatCancelDel'];
    for (const prefix of prefixes) {
      const searchInput = page.getByPlaceholder(/Search name or slug/i);
      await searchInput.fill(prefix);
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);
      
      while (true) {
          const deleteBtn = page.getByRole('button', { name: new RegExp('Delete ' + prefix, 'i') }).first();
          if (await deleteBtn.count() > 0) {
              await deleteBtn.click();
              const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));
              if (await dialog.count() > 0) {
                  await dialog.getByRole('button', { name: /^Delete$/i }).click();
                  await page.waitForTimeout(500);
              }
          } else {
              break;
          }
      }
    }
    await page.close();
  });
`;

content = content.replace(/(\n\}\);\n*)$/, '\n' + cleanupCode + '$1');
fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', content);
console.log('Added test.afterAll cleanup to positive specs');
