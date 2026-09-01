import { test, expect } from '@playwright/test';

test.describe('Admin System Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.locator('input[name="email"]').fill('hello@ideakicks.com');
    await page.locator('input[name="password"]').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForLoadState('networkidle');
  });

  test('UF-ADMIN-17: Admin View Notifications', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/notifications');
    
    await page.getByRole('combobox', { name: 'Filter by status' }).selectOption({ label: 'Failed' });
    
    await page.getByRole('combobox', { name: 'Filter by channel' }).selectOption({ label: 'Email' });
    
    const retryBtn = page.getByRole('button', { name: 'Retry', exact: true }).first();
    if (await retryBtn.isVisible()) {
        await expect(retryBtn).toBeEnabled();
    }
  });

  test('UF-ADMIN-18: Admin View Activity Log', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/activity');
    
    const table = page.locator('body');
    if (await table.isVisible()) { await expect(table).toContainText('Actor'); }
    
  });
});



