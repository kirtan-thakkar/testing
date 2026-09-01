import { test, expect } from '@playwright/test';

test.describe('Dashboard specific flows', () => {
  test('UF-DASH-01: Creator Dashboard Notifications', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('text=Your campaign was submitted for review')).toBeVisible();
    await page.click('text=My Campaigns');
    await expect(page.locator('text=Under Review')).toBeVisible();
  });
});
