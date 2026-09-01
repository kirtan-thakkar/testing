import { test, expect } from '@playwright/test';

test.describe('Admin Campaigns Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.locator('input[name="email"]').fill('hello@ideakicks.com');
    await page.locator('input[name="password"]').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForLoadState('networkidle');
  });

  test('UF-ADMIN-01: Admin Approve & Publish Project', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/projects');
    await page.getByRole('button', { name: 'Review', exact: true }).first().click();
    await page.getByRole('button', { name: 'Approve & Publish', exact: true }).first().click();
    
    // The second confirmation button inside the modal/panel
    await page.getByRole('button', { name: 'Approve & Publish', exact: true }).last().click({ force: true });
    
    await expect(page).toHaveURL(/.*\/campaigns\/.*/);
  });

  test('UF-ADMIN-02: Admin Reject Project Submission', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/projects');
    await page.getByRole('button', { name: 'Review', exact: true }).first().click();
    
    await page.getByRole('button', { name: 'Reject project', exact: true }).first().click();
    
    const confirmBtn = page.getByRole('button', { name: 'Reject project', exact: true }).last();
    await expect(confirmBtn).toBeDisabled();
    
    await page.locator('textarea').fill('The project description needs to be more detailed.');
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click({ force: true });
    
    await expect(page.locator('.toast, [role="alert"]')).toContainText(/rejected/i);
  });

  test('UF-ADMIN-03: Admin Search & Filter Campaigns', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/campaigns');
    
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('solar');
    await expect(page.locator('body')).toContainText('solar');
    
    await searchInput.fill('');
    await page.getByRole('combobox', { name: 'Filter by status' }).selectOption({ label: 'Active' });
    await expect(page).toHaveURL(/.*status=active/);
  });

  test('UF-ADMIN-04: Admin Create New Category', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/categories');
    await page.getByRole('button', { name: 'New category', exact: true }).click();
    
    await page.getByLabel('Name').fill('Alien Technology');
    await page.getByLabel('Parent category').selectOption({ label: 'Technology' });
    
    await page.getByRole('button', { name: 'Create category', exact: true }).click({ force: true });
    await expect(page.locator('body')).toContainText('Alien Technology');
  });

  test('UF-ADMIN-05: Admin Create Application Field', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/country-fields');
    await page.getByRole('button', { name: 'New field', exact: true }).click();
    
    await page.getByLabel('Country').selectOption({ label: 'United States' });
    await page.getByLabel('Label').fill('SSN');
    await page.getByLabel('Key').fill('ssn');
    
    await page.getByRole('button', { name: 'Create field', exact: true }).click({ force: true });
    await expect(page.locator('body')).toContainText('SSN');
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



