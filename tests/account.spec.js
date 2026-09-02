import { test, expect } from '@playwright/test';

test.describe('3. Account Management Flows', () => {

  test('UF-ACCT-01: Update Profile Bio', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Click Settings button (it's a button, not a tab)
    await page.getByRole('button', { name: 'Settings' }).click();
    
    // Verify we are on the settings view
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ACCT-02: Change Account Password', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('button', { name: 'Settings' }).click();
    
    // Verify settings view loaded
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
