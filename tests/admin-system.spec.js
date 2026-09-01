import { test, expect } from '@playwright/test';

test.describe('Admin System Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.getByLabel('Email address').fill('hello@ideakicks.com');
    await page.getByLabel('Password').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('UF-ADMIN-17: Admin View Notifications', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/notifications');
    
    await expect(page.locator('table')).toBeVisible();
    
    await page.getByRole('combobox', { name: 'Filter by status' }).click();
    await page.getByRole('option', { name: 'Failed' }).click();
    
    await page.getByRole('combobox', { name: 'Filter by channel' }).click();
    await page.getByRole('option', { name: 'Email' }).click();
    
    const retryBtn = page.getByRole('button', { name: 'Retry', exact: true }).first();
    if (await retryBtn.isVisible()) {
        await expect(retryBtn).toBeEnabled();
    }
  });

  test('UF-ADMIN-18: Admin View Activity Log', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/activity');
    
    const table = page.locator('table');
    await expect(table).toBeVisible();
    await expect(table).toContainText('Actor');
    await expect(table).toContainText('Action');
  });
});
