import {test,expect} from '@playwright/test';

test.describe('Admin People Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.getByLabel('Email address').fill('hello@ideakicks.com');
    await page.getByLabel('Password').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('UF-ADMIN-10: Admin User Management', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/users');
    
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('kirtan');
    await expect(page.locator('table')).toContainText('kirtan');
    
    await page.getByRole('button', { name: 'New user', exact: true }).click();
    
    const slideOut = page.getByRole('dialog');
    await expect(slideOut).toBeVisible();
    
    await slideOut.getByLabel('First name').fill('Test');
    await slideOut.getByLabel('Last name').fill('User');
    await slideOut.getByLabel('Email address').fill('testuser@ideakicks.com');
    await slideOut.getByLabel('Role').selectOption({ label: 'Admin' });
    
    await slideOut.getByRole('button', { name: 'Create user', exact: true }).click({ force: true });
  });

  test('UF-ADMIN-11: Admin Manage Roles', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/roles');
    
    await page.getByRole('button', { name: 'New role', exact: true }).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    await dialog.getByLabel('Role name').fill('Finance Manager');
    await dialog.getByLabel('Access level').selectOption({ label: 'L3' });
    
    await dialog.getByRole('button', { name: 'Create role', exact: true }).click({ force: true });
  });

  test('UF-ADMIN-12: Admin Review Deletion Requests', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/deletion-requests');
    
    await expect(page.locator('table')).toBeVisible();
    
    await page.getByRole('combobox', { name: 'Filter by status' }).click();
    await page.getByRole('option', { name: 'Pending' }).click();
    await expect(page).toHaveURL(/.*status=pending/i);
  });
});
