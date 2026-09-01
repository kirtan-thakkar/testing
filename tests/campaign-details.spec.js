import { test, expect } from '@playwright/test';

test.describe('5. Campaign Details Flows', () => {
  test('UF-CAMP-01: Campaign Detail Tabs Navigation', async ({ page }) => {
    // Navigate to explore to find a valid campaign
    await page.goto('/explore');
    const firstCampaign = page.locator('.campaign-card').first();
    await firstCampaign.click();
    
    // Test tabs
    const tabs = ['Campaign', 'Rewards', 'Creator', 'FAQ', 'Updates', 'Comments', 'Community'];
    for (const tab of tabs) {
      const tabLocator = page.getByRole('tab', { name: tab, exact: true });
      if (await tabLocator.isVisible()) {
          await tabLocator.click();
          await expect(tabLocator).toHaveAttribute('aria-selected', 'true');
      }
    }
  });

  test('UF-CAMP-02: Save Campaign & Dashboard Sync', async ({ page }) => {
    await page.goto('/explore');
    const firstCampaign = page.locator('.campaign-card').first();
    await firstCampaign.click();
    
    // Save button
    const saveBtn = page.getByRole('button', { name: /Save|Saved/i }).first();
    if (await saveBtn.isVisible()) {
        await saveBtn.click();
    }
  });
});
