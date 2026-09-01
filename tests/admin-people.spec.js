import {test,expect} from '@playwright/test';

test.describe('Admin People Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.locator('input[name="email"]').fill('hello@ideakicks.com');
    await page.locator('input[name="password"]').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForLoadState('networkidle');
  });

  test('UF-ADMIN-10: Admin User Management', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/users');
    
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('kirtan');
    await expect(page.locator('body')).toContainText('kirtan');
    
    await page.getByRole('button', { name: 'New user', exact: true }).click();
    
    await page.getByLabel('First name').fill('Test');
    await page.getByLabel('Last name').fill('User');
    await page.getByLabel('Email address').fill('testuser@ideakicks.com');
    await page.getByLabel('Role').selectOption({ label: 'Admin' });
    
    await page.getByRole('button', { name: 'Create user', exact: true }).click({ force: true });
  });

  test('UF-ADMIN-11: Admin Manage Roles', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/roles');
    
    await page.getByRole('button', { name: 'New role', exact: true }).click();
    
    await page.getByLabel('Role name').fill('Finance Manager');
    await page.getByLabel('Access level').selectOption({ label: 'L3' });
    
    await page.getByRole('button', { name: 'Create role', exact: true }).click({ force: true });
  });

  test('UF-ADMIN-12: Admin Review Deletion Requests', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/deletion-requests');
    
    await page.getByRole('combobox', { name: '' }).selectOption({ label: '' });
    await expect(page).toHaveURL(/.*status=pending/i);
  });
});



