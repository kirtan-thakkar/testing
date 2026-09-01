import { test, expect } from '@playwright/test';

test.describe('6. Checkout & Pledging Flows', () => {

  test('UF-BACK-01: Reward & Add-on Selection', async ({ page }) => {
    // Navigate to a known campaign's backing flow
    await page.goto('https://187.77.79.40.nip.io/explore');
    
    // Find first available campaign and click back
    const campaignCard = page.locator('.campaign-card').first();
    await campaignCard.click();
    await page.getByRole('button', { name: /Back this project/i }).click();
    
    // Select tier
    await expect(page.getByText(/Pledge without a reward/i)).toBeVisible();
    await page.getByRole('button', { name: /Select/i }).first().click();
    
    // Add-ons step
    await expect(page).toHaveURL(/.*\/addons/i);
    await expect(page.getByText(/No add-ons for this campaign/i)).toBeVisible();
    
    const continueBtn = page.getByRole('button', { name: /Continue to payment/i });
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();
  });

  test('UF-BACK-02: Payment Terms Validation (Negative Path)', async ({ page }) => {
    // Assume we've navigated through the previous flow to payment step
    // We can just stub navigation for the test context
    await page.goto('https://187.77.79.40.nip.io/explore');
    await page.locator('.campaign-card').first().click();
    await page.getByRole('button', { name: /Back this project/i }).click();
    await page.getByRole('button', { name: /Select/i }).first().click();
    await page.getByRole('button', { name: /Continue to payment/i }).click();
    
    // Fill shipping
    await page.getByRole('textbox', { name: /Name/i }).fill('Test Backer');
    await page.getByRole('textbox', { name: /Address/i }).fill('123 Test St');
    
    const completeBtn = page.getByRole('button', { name: /Complete Pledge/i });
    
    // Negative path: Ensure button is disabled before checking terms
    await expect(completeBtn).toBeDisabled();
  });

  test('UF-BACK-03: Complete Pledge (Positive Path)', async ({ page }) => {
    await page.goto('https://187.77.79.40.nip.io/explore');
    await page.locator('.campaign-card').first().click();
    await page.getByRole('button', { name: /Back this project/i }).click();
    await page.getByRole('button', { name: /Select/i }).first().click();
    await page.getByRole('button', { name: /Continue to payment/i }).click();
    
    await page.getByRole('textbox', { name: /Name/i }).fill('Test Backer');
    await page.getByRole('textbox', { name: /Address/i }).fill('123 Test St');
    
    // Check terms
    await page.getByRole('checkbox', { name: /I agree to the Terms/i }).check();
    
    const completeBtn = page.getByRole('button', { name: /Complete Pledge/i });
    await expect(completeBtn).toBeEnabled();
    await completeBtn.click();
    
    // Verify success page
    await expect(page).toHaveURL(/.*\/success/i);
    await expect(page.getByText(/confirmation/i)).toBeVisible();
    
    // Check dashboard sync
    await page.goto('https://187.77.79.40.nip.io/dashboard');
    await page.getByRole('tab', { name: /Backed Projects/i }).click();
    // Assuming the grid has at least one item
    await expect(page.locator('.campaign-card').first()).toBeVisible();
  });
});
