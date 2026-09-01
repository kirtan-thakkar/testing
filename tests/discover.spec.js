const { test, expect } = require('@playwright/test');

test.describe('4. Discovery & Search Flows', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('UF-DISC-01: Global Header Search', async ({ page }) => {
    await page.goto('/');
    const searchBtn = page.locator('button').filter({ hasText: /search/i }).first();
    if(await searchBtn.isVisible()) {
      await searchBtn.click();
    }
    await page.fill('input[type="search"]', 'solar');
    await page.keyboard.press('Enter');
    await page.waitForURL('**/explore?q=solar');
    await expect(page.locator('input[type="search"]')).toHaveValue('solar');
    await expect(page.locator('text=campaigns')).toBeVisible();
  });

  test('UF-DISC-02: Unsuccessful Campaign Search', async ({ page }) => {
    await page.goto('/explore');
    await page.fill('input[type="search"]', 'xyz123nonsense');
    await page.keyboard.press('Enter');
    await expect(page.locator('text=No campaigns found')).toBeVisible();
  });

  test('UF-DISC-03: Explore Category Filtering', async ({ page }) => {
    await page.goto('/explore');
    const techBtn = page.locator('button:has-text("Technology")');
    await techBtn.click();
    await expect(page.locator('text=Showing Technology')).toBeVisible();
  });
});
