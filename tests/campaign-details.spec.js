import { test, expect } from '@playwright/test';

test.describe('5. Campaign Details Flows', () => {
  test('UF-CAMP-01: Campaign Detail Tabs Navigation', async ({ page }) => {
    await page.goto('/campaign/solar');
    const tabs = ['Campaign', 'Rewards', 'Creator', 'FAQ', 'Updates', 'Comments', 'Community'];
    for (const tab of tabs) {
      await expect(page.locator(`text=${tab}`).first()).toBeVisible();
    }
  });

  test('UF-CAMP-02: Save Campaign & Dashboard Sync', async ({ page }) => {
    await page.goto('/campaign/solar');
    await page.click('button:has-text("Save")');
    await expect(page.locator('button:has-text("Saved")')).toBeVisible();
    
    await page.goto('/dashboard');
    await expect(page.locator('text=1 Saved')).toBeVisible();
    await page.click('text=Saved');
    await expect(page.locator('text=solar').first()).toBeVisible();
  });
});
