import { test, expect } from '@playwright/test';

test.describe('Admin Engagement Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.getByLabel('Email address').fill('hello@ideakicks.com');
    await page.getByLabel('Password').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('UF-ADMIN-13: Admin Manage Contact Inbox', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/inbox');
    
    await expect(page.locator('table')).toBeVisible();
    
    // Test the inline dropdown state change
    const firstStatusDropdown = page.getByRole('combobox', { name: 'Status' }).first();
    await firstStatusDropdown.click();
    await page.getByRole('option', { name: 'In progress' }).click();
    
    await expect(firstStatusDropdown).toHaveText(/In progress/i);
  });

  test('UF-ADMIN-14: Admin View Subscribers', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/subscribers');
    
    await expect(page.locator('table')).toBeVisible();
    
    await page.getByRole('combobox', { name: 'Filter by status' }).click();
    await page.getByRole('option', { name: 'Subscribed' }).click();
  });
});
