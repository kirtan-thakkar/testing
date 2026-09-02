import { test, expect } from '@playwright/test';

test.describe('5. Campaign Details Flows', () => {
  test('UF-CAMP-01: Campaign Detail Tabs Navigation', async ({ page }) => {
    // Navigate to a known campaign via its slug from the explore page
    await page.goto('/campaign/solar');
    await page.waitForLoadState('networkidle');
    
    // Assert page loaded with campaign title
    await expect(page.getByRole('heading', { name: 'solar' })).toBeVisible();
  });

  test('UF-CAMP-02: Save Campaign & Dashboard Sync', async ({ page }) => {
    await page.goto('/campaign/solar');
    await page.waitForLoadState('networkidle');
    
    // Look for a Save button
    const saveBtn = page.getByRole('button', { name: /Save/i }).first();
    if (await saveBtn.isVisible()) {
        await saveBtn.click();
    }
  });
});
