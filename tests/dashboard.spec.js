import { test, expect } from '@playwright/test';

test.describe('Dashboard specific flows', () => {
  test('UF-DASH-01: Creator Dashboard Tabs Navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Verify dashboard heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Test dashboard tabs (they are buttons, NOT tabs)
    await page.getByRole('button', { name: 'Backed Projects' }).click();
    await page.getByRole('button', { name: 'Saved' }).click();
    await page.getByRole('button', { name: 'My Campaigns' }).click();
    await page.getByRole('button', { name: 'Overview' }).click();
  });
});
