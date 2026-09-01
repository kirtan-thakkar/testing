import { test, expect } from '@playwright/test';

test.describe('6. Checkout & Pledging Flows', () => {
  test('UF-BACK-01: Reward & Add-on Selection', async ({ page }) => {
    await page.goto('/campaign/solar/back');
    await page.click('text=Pledge without a reward');
    await page.waitForURL('**/back/addons');
    await expect(page.locator('text=No add-ons for this campaign')).toBeVisible();
    await expect(page.locator('button:has-text("Continue to payment")')).toBeEnabled();
  });

  test('UF-BACK-02: Payment Terms Validation', async ({ page }) => {
    await page.goto('/campaign/solar/back/payment');
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="address"]', '123 Test Ave');
    await page.fill('input[name="zip"]', '12345');
    
    const completeBtn = page.locator('button:has-text("Complete Pledge")');
    await expect(completeBtn).toBeDisabled();
  });

  test('UF-BACK-03: Complete Pledge', async ({ page }) => {
    await page.goto('/campaign/solar/back/payment');
    // Ensure terms checkbox is checked
    await page.check('input[type="checkbox"]'); 
    
    const completeBtn = page.locator('button:has-text("Complete Pledge")');
    await expect(completeBtn).toBeEnabled();
    await completeBtn.click();
    
    await page.waitForURL('**/back/success');
    
    await page.goto('/dashboard');
    await page.click('text=Backed Projects');
    await expect(page.locator('text=solar').first()).toBeVisible();
  });
});
