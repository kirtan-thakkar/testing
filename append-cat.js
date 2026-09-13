const fs = require('fs');
const tests = `
  test('ADM-CAT-FUN-019: Verify a hidden category can be shown', async () => {
    log.info('ADM-CAT-FUN-019', 'start');
    await page.goto(\`\${ADMIN_URL}/categories\`);
    
    // Create and hide a category first
    const uniqueName = \`ToShow Cat \${Date.now()}\`;
    await page.getByRole('button', { name: /New category/i }).click();
    await page.getByLabel(/^Name/i).fill(uniqueName);
    await page.getByRole('button', { name: /Create category/i }).click();
    await expect(page.getByRole('heading', { name: 'New category' })).toBeHidden({ timeout: 10000 });
    
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    const row = page.getByRole('row', { name: uniqueName }).first();
    await row.getByRole('button', { name: /^Hide$/i }).click();
    const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));
    await dialog.getByRole('button', { name: /^Hide$/i }).click();
    await expect(dialog).toBeHidden();
    await page.waitForTimeout(1000);
    
    // Now Show it
    await row.getByRole('button', { name: /^Show$/i }).click();
    await dialog.getByRole('button', { name: /^Show$/i }).click();
    await expect(dialog).toBeHidden();
    await page.waitForTimeout(1000);
    
    // Verify it is Active again
    await expect(row.getByRole('button', { name: /^Hide$/i })).toBeVisible();
    
    log.info('ADM-CAT-FUN-019', 'ok');
  });

  test('ADM-CAT-FUN-020: Verify Show action can be undone', async () => {
    log.info('ADM-CAT-FUN-020', 'start');
    await page.goto(\`\${ADMIN_URL}/categories\`);
    
    const uniqueName = \`CancelShow Cat \${Date.now()}\`;
    await page.getByRole('button', { name: /New category/i }).click();
    await page.getByLabel(/^Name/i).fill(uniqueName);
    await page.getByRole('button', { name: /Create category/i }).click();
    await expect(page.getByRole('heading', { name: 'New category' })).toBeHidden({ timeout: 10000 });
    
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    const row = page.getByRole('row', { name: uniqueName }).first();
    await row.getByRole('button', { name: /^Hide$/i }).click();
    const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));
    await dialog.getByRole('button', { name: /^Hide$/i }).click();
    await expect(dialog).toBeHidden();
    await page.waitForTimeout(1000);
    
    // Attempt to show it, but cancel
    await row.getByRole('button', { name: /^Show$/i }).click();
    await dialog.getByRole('button', { name: /^Cancel$/i }).click();
    await expect(dialog).toBeHidden();
    
    // Verify it is still Hidden
    await expect(row.getByRole('button', { name: /^Show$/i })).toBeVisible();
    
    log.info('ADM-CAT-FUN-020', 'ok');
  });

  test('ADM-CAT-FUN-024: Verify Categories displays the default listing state', async () => {
    log.info('ADM-CAT-FUN-024', 'start');
    await page.goto(\`\${ADMIN_URL}/categories\`);
    
    // Verify Rows per page default is 10
    const rowsPerPage = page.getByRole('combobox', { name: /Rows per page/i });
    await expect(rowsPerPage).toHaveValue('10');
    
    // Verify 1-10 is shown
    await expect(page.getByText(/1[\\u2012\\u2013\\u2014\\u2015\\-]?10 of \\d+/)).toBeVisible();
    
    log.info('ADM-CAT-FUN-024', 'ok');
  });
`;
let content = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf8');
content = content.replace(/}\);\s*$/, tests + '\n});');
fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', content);
console.log('Appended tests to admin-categories.');
