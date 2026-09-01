const { test, expect } = require('@playwright/test');

test.describe('Admin Campaigns Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.getByLabel('Email address').fill('hello@ideakicks.com');
    await page.getByLabel('Password').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('UF-ADMIN-01: Admin Approve & Publish Project', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/projects');
    await page.getByRole('button', { name: 'Review', exact: true }).first().click();
    await page.getByRole('button', { name: 'Approve & Publish', exact: true }).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Approve & Publish', exact: true }).click({ force: true });
    
    await expect(page).toHaveURL(/.*\/campaigns\/.*/);
  });

  test('UF-ADMIN-02: Admin Reject Project Submission', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/projects');
    await page.getByRole('button', { name: 'Review', exact: true }).first().click();
    
    await page.getByRole('button', { name: 'Reject project', exact: true }).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    const confirmBtn = dialog.getByRole('button', { name: 'Reject project', exact: true });
    await expect(confirmBtn).toBeDisabled();
    
    await dialog.locator('textarea').fill('The project description needs to be more detailed.');
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click({ force: true });
    
    await expect(page.locator('.toast, [role="alert"]')).toContainText(/rejected/i);
  });

  test('UF-ADMIN-03: Admin Search & Filter Campaigns', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/campaigns');
    
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('solar');
    await expect(page.locator('table')).toContainText('solar');
    
    await searchInput.fill('');
    await page.getByRole('combobox', { name: 'Filter by status' }).click();
    await page.getByRole('option', { name: 'Active' }).click();
    await expect(page).toHaveURL(/.*status=active/);
  });

  test('UF-ADMIN-04: Admin Create New Category', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/categories');
    await page.getByRole('button', { name: 'New category', exact: true }).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    await dialog.getByLabel('Name').fill('Alien Technology');
    await dialog.getByLabel('Parent category').selectOption({ label: 'Technology' });
    
    await dialog.getByRole('button', { name: 'Create category', exact: true }).click({ force: true });
    await expect(page.locator('table')).toContainText('Alien Technology');
  });

  test('UF-ADMIN-05: Admin Create Application Field', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/country-fields');
    await page.getByRole('button', { name: 'New field', exact: true }).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    await dialog.getByLabel('Country').selectOption({ label: 'United States' });
    await dialog.getByLabel('Label').fill('SSN');
    await dialog.getByLabel('Key').fill('ssn');
    
    await dialog.getByRole('button', { name: 'Create field', exact: true }).click({ force: true });
    await expect(page.locator('table')).toContainText('SSN');
  });

  test('UF-ADMIN-06: Admin View Partners Tab', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/partners');
    
    await page.getByRole('tab', { name: 'Mentors' }).click();
    await expect(page.getByText('No applications yet')).toBeVisible();
    
    await page.getByRole('tab', { name: 'Vendors' }).click();
    await expect(page.getByText('No applications yet')).toBeVisible();
    
    await page.getByRole('tab', { name: 'Investors' }).click();
    await expect(page.getByText('No applications yet')).toBeVisible();
  });
});
