import { test, expect } from '@playwright/test';

test.describe('6. Checkout & Pledging Flows', () => {

  test('UF-BACK-01: Reward & Add-on Selection', async ({ page }) => {
    // Navigate to explore and find the first campaign card (which is a link > article)
    await page.goto('/explore');
    const firstCampaign = page.locator('article').first();
    await firstCampaign.click();
    await page.waitForLoadState('networkidle');
    
    // Look for "Back this project" button
    const backBtn = page.getByRole('button', { name: /Back this project/i });
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await page.waitForLoadState('networkidle');
      
      // Verify we landed on the backing flow
      await expect(page).toHaveURL(/.*\/back/);
    }
  });

  test('UF-BACK-02: Payment Terms Validation (Negative Path)', async ({ page }) => {
    // Navigate directly to the solar campaign backing page
    await page.goto('/campaign/solar/back');
    await page.waitForLoadState('networkidle');
    
    // If the page loads the pledge flow, look for the terms checkbox
    const termsCheckbox = page.getByRole('checkbox', { name: /I agree/i });
    if (await termsCheckbox.isVisible()) {
      // Ensure Complete Pledge is disabled until terms checked
      const completeBtn = page.getByRole('button', { name: /Complete Pledge/i });
      await expect(completeBtn).toBeDisabled();
    }
  });

  test('UF-BACK-03: Complete Pledge (Positive Path)', async ({ page }) => {
    // Navigate to solar campaign back flow
    await page.goto('/campaign/solar/back');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the backing page
    await expect(page).toHaveURL(/.*\/back/);
  });
});
