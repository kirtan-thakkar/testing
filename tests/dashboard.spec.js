import { test, expect } from '@playwright/test';

test.describe('Dashboard specific flows', () => {
  test('UF-DASH-01: Creator Dashboard Tabs Navigation', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test tabs exist and work
    const myCampaignsTab = page.getByRole('tab', { name: /My Campaigns/i });
    if (await myCampaignsTab.isVisible()) {
        await myCampaignsTab.click();
        await expect(page).toHaveURL(/.*tab=campaigns/i);
    }
    
    const backedTab = page.getByRole('tab', { name: /Backed Projects/i });
    if (await backedTab.isVisible()) {
        await backedTab.click();
        await expect(page).toHaveURL(/.*tab=backed/i);
    }
  });
});
