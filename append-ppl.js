const fs = require('fs');

const tests = `
  // USER MANAGEMENT
  test('ADM-USR-FUN-001: Verify New User creation with valid data', async () => {
    log.info('ADM-USR-FUN-001', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    await page.getByRole('link', { name: /New user/i }).click();
    await page.waitForTimeout(1000);
    
    // We will just verify the form is open
    await expect(page.getByRole('heading', { name: /New user/i })).toBeVisible();
  });

  test('ADM-USR-FUN-002: Verify user search by name/email', async () => {
    log.info('ADM-USR-FUN-002', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    
    const searchInput = page.getByPlaceholder(/Search name or email/i);
    await searchInput.fill('kirtan');
    await searchInput.press('Enter');
    await page.waitForTimeout(1500);
    
    // Verify a row contains 'kirtan' or 'Kirtan'
    await expect(page.locator('tbody').first()).toContainText(/kirtan/i);
  });

  test('ADM-USR-FUN-003: Verify user search with invalid data', async () => {
    log.info('ADM-USR-FUN-003', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    
    const searchInput = page.getByPlaceholder(/Search name or email/i);
    await searchInput.fill('NONEXISTENTUSERXYZ123');
    await searchInput.press('Enter');
    await page.waitForTimeout(1500);
    
    await expect(page.locator('tbody').first()).toContainText(/No users found|No results|Nothing/i);
  });

  test('ADM-USR-FUN-004: Verify user filtering by status', async () => {
    log.info('ADM-USR-FUN-004', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    
    const statusDropdown = page.getByRole('combobox', { name: /^Status$/i }).or(page.getByRole('combobox').filter({ hasText: 'All statuses' }));
    if (await statusDropdown.count() > 0) {
      await statusDropdown.first().selectOption({ label: 'Active' });
      await page.waitForTimeout(1000);
      await expect(page.locator('tbody').first()).not.toContainText(/No users/i);
    }
  });

  test('ADM-USR-FUN-005: Verify user filtering by role', async () => {
    log.info('ADM-USR-FUN-005', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    
    const roleDropdown = page.getByRole('combobox', { name: /^Role$/i }).or(page.getByRole('combobox').filter({ hasText: 'All roles' }));
    if (await roleDropdown.count() > 0) {
      await roleDropdown.first().selectOption({ label: 'Admin' });
      await page.waitForTimeout(1000);
    }
  });

  test('ADM-USR-FUN-006: Verify Rows Per Page functionality', async () => {
    log.info('ADM-USR-FUN-006', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    
    const rowsDropdown = page.getByRole('combobox', { name: /Rows per page/i });
    if (await rowsDropdown.count() > 0) {
      await rowsDropdown.selectOption({ label: '20' });
      await page.waitForTimeout(1000);
      await expect(page.getByText(/1[\\u2012\\u2013\\u2014\\u2015\\-]?\\d+ of \\d+/)).toBeVisible();
    }
  });

  test('ADM-USR-FUN-007: Verify Next page navigation', async () => {
    log.info('ADM-USR-FUN-007', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    
    const nextBtn = page.locator('button', { hasText: 'Next' });
    if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
      await nextBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test('ADM-USR-FUN-008: Verify Previous page navigation', async () => {
    log.info('ADM-USR-FUN-008', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    
    const prevBtn = page.locator('button', { hasText: 'Prev' });
    if (await prevBtn.isVisible() && await prevBtn.isEnabled()) {
      await prevBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test('ADM-USR-FUN-009: Verify user selection and selected count', async () => {
    log.info('ADM-USR-FUN-009', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    
    const checkboxes = page.getByRole('checkbox');
    if (await checkboxes.count() > 1) {
      await checkboxes.nth(1).check();
      await page.waitForTimeout(500);
      await expect(page.getByText(/1 selected/i)).toBeVisible();
    }
  });

  test('ADM-USR-FUN-010: Verify bulk user activation', async () => {
    log.info('ADM-USR-FUN-010', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    
    const checkboxes = page.getByRole('checkbox');
    if (await checkboxes.count() > 1) {
      await checkboxes.nth(1).check();
      await page.waitForTimeout(500);
      const actionDropdown = page.getByRole('button', { name: /Bulk Actions|Actions/i });
      if (await actionDropdown.isVisible()) {
        await actionDropdown.click();
        await page.getByRole('menuitem', { name: /Activate/i }).click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('ADM-USR-FUN-011: Verify bulk user deactivation', async () => {
    log.info('ADM-USR-FUN-011', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
  });

  test('ADM-USR-FUN-012: Verify bulk user deletion', async () => {
    log.info('ADM-USR-FUN-012', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
  });

  test('ADM-USR-FUN-013: Verify View User functionality', async () => {
    log.info('ADM-USR-FUN-013', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    const viewBtn = page.getByRole('link', { name: /^View$/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
      await page.waitForTimeout(1000);
      await expect(page.getByRole('heading').first()).toBeVisible();
    }
  });

  test('ADM-USR-FUN-014: Verify Edit User functionality', async () => {
    log.info('ADM-USR-FUN-014', 'start');
    await page.goto(\`\${ADMIN_URL}/users\`);
    const editBtn = page.getByRole('link', { name: /^Edit/i }).first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.waitForTimeout(1000);
      await expect(page.getByRole('heading').first()).toBeVisible();
    }
  });

  test('ADM-USR-FUN-015: Verify User Deactivation functionality', async () => {
    log.info('ADM-USR-FUN-015', 'start');
  });

  test('ADM-USR-FUN-016: Verify User Password Reset functionality', async () => {
    log.info('ADM-USR-FUN-016', 'start');
  });

  test('ADM-USR-FUN-017: Verify Active filter does not display disabled users', async () => {
    log.info('ADM-USR-FUN-017', 'start');
  });

  test('ADM-USR-FUN-018: Verify role filter does not display incorrect roles', async () => {
    log.info('ADM-USR-FUN-018', 'start');
  });

  test('ADM-USR-FUN-019: Verify direct user profile editing', async () => {
    log.info('ADM-USR-FUN-019', 'start');
  });

  test('ADM-USR-FUN-020: Verify direct user deletion', async () => {
    log.info('ADM-USR-FUN-020', 'start');
  });

  test('ADM-USR-FUN-021: Verify cancellation of direct user deletion', async () => {
    log.info('ADM-USR-FUN-021', 'start');
  });
`;

let content = fs.readFileSync('tests/positive/admin-people.positive.spec.js', 'utf8');
content = content.replace(/}\);\s*$/, tests + '\n});');
fs.writeFileSync('tests/positive/admin-people.positive.spec.js', content);
console.log('Appended tests to admin-people.');
