
import { test, expect } from '@playwright/test';

test.describe('Admin Content Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.locator('input[name="email"]').fill('hello@ideakicks.com');
    await page.locator('input[name="password"]').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForLoadState('networkidle');
  });

  test('UF-ADMIN-15: Admin Manage CMS Pages', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/cms');
    
    await page.getByRole('combobox', { name: '' }).selectOption({ label: '' });
    
    await page.getByRole('button', { name: 'New page', exact: true }).click();
    await expect(page).toHaveURL(/.*\/cms\/pages\/new/);
  });

  test('UF-ADMIN-16: Admin Configure Global CMS Content', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/cms/navigation');
    
    const moveDownBtn = page.getByRole('button', { name: /Move .* down/i }).first();
    await moveDownBtn.click();
    
    await page.goto('https://admin.187.77.79.40.nip.io/cms/settings');
    const feeInput = page.getByRole('spinbutton', { name: /Platform fee/i });
    await expect(feeInput).toBeVisible();
  });
});


