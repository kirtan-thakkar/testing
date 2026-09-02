import { test, expect } from '@playwright/test';

test.describe.serial('Admin People Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
    await page.getByRole('textbox', { name: 'Password' }).fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in' }).click({ force: true });
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    if (page) await page.close();
  });

  test('UF-ADMIN-10: Admin User Management', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/users');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
    
    const searchInput = page.getByRole('textbox', { name: 'Search users' });
    if (await searchInput.isVisible()) {
      await searchInput.fill('kirtan');
      await expect(page.locator('body')).toContainText(/kirtan/i);
    }
    
    const newUserLink = page.getByRole('link', { name: 'New user' });
    await expect(newUserLink).toBeVisible();
  });

  test('UF-ADMIN-11: Admin Manage Roles', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/roles');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { name: 'Roles & Permissions' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New role' })).toBeVisible();
    await expect(page.locator('body')).toContainText(/Super Admin/i);
  });

  test('UF-ADMIN-12: Admin Review Deletion Requests', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/deletion-requests');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/deletion-requests/);
  });
});
