const fs = require('fs');

const testsToAppend = `
  test('ADM-CAM-FUN-003: Campaigns Search Positive', async () => {
    log.info('ADM-CAM-FUN-003', 'start');
    await page.goto(\`\${ADMIN_URL}/campaigns\`);
    
    const searchInput = page.getByPlaceholder(/Search by campaign name/i);
    await searchInput.fill('solar');
    await searchInput.press('Enter');
    await page.waitForTimeout(1500);
    
    // Relevant result should be displayed
    await expect(page.getByRole('row', { name: /solar/i }).first()).toBeVisible();
    log.info('ADM-CAM-FUN-003', 'ok');
  });

  test('ADM-CAM-FUN-004: Campaigns Search Negative', async () => {
    log.info('ADM-CAM-FUN-004', 'start');
    await page.goto(\`\${ADMIN_URL}/campaigns\`);
    
    const searchInput = page.getByPlaceholder(/Search by campaign name/i);
    await searchInput.fill('XYZNONEXISTENT123');
    await searchInput.press('Enter');
    await page.waitForTimeout(1500);
    
    // Check for an empty state message or that there are no campaign rows
    const rows = await page.getByRole('row').count();
    // Usually header is 1 row. So if 0 or 1, it's empty
    expect(rows).toBeLessThanOrEqual(1);
    log.info('ADM-CAM-FUN-004', 'ok');
  });

  test('ADM-CAM-FUN-005: Statuses Dropdown Selection Box', async () => {
    log.info('ADM-CAM-FUN-005', 'start');
    await page.goto(\`\${ADMIN_URL}/campaigns\`);
    
    const statusDropdown = page.getByRole('combobox', { name: /Filter by status/i });
    await expect(statusDropdown).toBeVisible();
    
    // Select Active
    await statusDropdown.selectOption({ label: 'Active' });
    await page.waitForTimeout(1000);
    
    // Select Funded
    await statusDropdown.selectOption({ label: 'Funded' });
    await page.waitForTimeout(1000);
    
    // Select Cancelled
    await statusDropdown.selectOption({ label: 'Cancelled' });
    await page.waitForTimeout(1000);
    
    log.info('ADM-CAM-FUN-005', 'ok');
  });

  test('ADM-CAM-FUN-007: Dropdown Selection Box-Cancelled Status and Review submissions', async () => {
    log.info('ADM-CAM-FUN-007', 'start');
    await page.goto(\`\${ADMIN_URL}/campaigns\`);
    
    const statusDropdown = page.getByRole('combobox', { name: /Filter by status/i });
    await statusDropdown.selectOption({ label: 'Cancelled' });
    await page.waitForTimeout(1500);
    
    const reviewBtn = page.getByRole('button', { name: /Review submissions/i }).or(page.getByRole('link', { name: /Review submissions/i })).first();
    await expect(reviewBtn).toBeVisible();
    await reviewBtn.click();
    await page.waitForTimeout(1500);
    
    // Check that we moved or a form opened
    // Just expect some form or heading to be visible
    await expect(page.getByRole('heading').first()).toBeVisible();
    
    log.info('ADM-CAM-FUN-007', 'ok');
  });

  test('ADM-CAM-FUN-008: Campaigns action column view button', async () => {
    log.info('ADM-CAM-FUN-008', 'start');
    await page.goto(\`\${ADMIN_URL}/campaigns\`);
    
    const viewBtn = page.getByRole('button', { name: /^View$/i }).or(page.getByRole('link', { name: /^View$/i })).first();
    await expect(viewBtn).toBeVisible();
    await viewBtn.click();
    await page.waitForTimeout(1500);
    
    // Details should be displayed
    await expect(page.getByRole('heading').first()).toBeVisible();
    log.info('ADM-CAM-FUN-008', 'ok');
  });
});
`;

let content = fs.readFileSync('tests/positive/admin-campaigns.positive.spec.js', 'utf8');
content = content.replace(/}\);\s*$/, testsToAppend);
fs.writeFileSync('tests/positive/admin-campaigns.positive.spec.js', content);
console.log('Appended successfully');
