import { test, expect } from '@playwright/test';

test.describe('Admin Engagement Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.locator('input[name="email"]').fill('hello@ideakicks.com');
    await page.locator('input[name="password"]').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForLoadState('networkidle');
  });

  test('UF-ADMIN-13: Admin Manage Contact Inbox', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/inbox');
    
    // Test the inline dropdown state change
    const firstStatusDropdown = page.getByRole('combobox', { name: 'Status' }).first();
    await firstStatusDropdown.selectOption({ label: 'In progress' });
    
    await expect(firstStatusDropdown).toHaveText(/In progress/i);
  });

  test('UF-ADMIN-14: Admin View Subscribers', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/subscribers');
    
    await page.getByRole('combobox', { name: '' }).selectOption({ label: '' });
  });
});



