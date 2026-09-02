import { test, expect } from '@playwright/test';

test.describe('2. Campaign Creation (Creator Wizard) Flows', () => {

  test('UF-CREA-01: Campaign Application Page Loads', async ({ page }) => {
    await page.goto('/start');
    await page.waitForLoadState('networkidle');
    
    // Verify the start/application page renders
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-CREA-02: Campaign Application - Navigate to Application', async ({ page }) => {
    await page.goto('/start');
    await page.waitForLoadState('networkidle');
    
    // Click "Apply now" link if visible
    const applyLink = page.getByRole('link', { name: /Apply now/i });
    if (await applyLink.isVisible()) {
      await applyLink.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Verify page loaded
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
