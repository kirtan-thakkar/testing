const { test, expect } = require('@playwright/test');

test.describe('2. Campaign Creation (Creator Wizard) Flows', () => {
  // Implicitly uses global authenticated state

  test('UF-CREA-01: Campaign Application - Step 1 Validation Errors', async ({ page }) => {
    await page.goto('/start/application');
    await page.click('button:has-text("Continue")');
    await expect(page.locator('text=required').first()).toBeVisible(); // or specific missing fields
    await expect(page).toHaveURL(/.*\/start\/application/);
  });

  test('UF-CREA-02: Campaign Application - Draft Persistence', async ({ page }) => {
    await page.goto('/start/application');
    await page.fill('input[name="businessName"]', 'My Business');
    await page.fill('input[name="pan"]', 'ABCDE1234F');
    await page.click('button:has-text("Continue")');
    await page.goto('/');
    await page.goto('/start/application');
    await expect(page.locator('input[name="businessName"]')).toHaveValue('My Business');
  });

  test('UF-CREA-03: Campaign Application - Step 2 to Submission', async ({ page }) => {
    await page.goto('/start/application?step=2');
    // Using simple placeholders as exact inputs might vary
    await page.fill('input[name="title"]', 'New Campaign');
    await page.fill('input[name="subtitle"]', 'Subtitle');
    await page.fill('textarea[name="story"]', 'Story');
    await page.fill('input[name="goal"]', '10000');
    await page.click('button:has-text("Continue")');
    
    await page.click('button:has-text("Submit for Review")');
    
    await expect(page.locator('text=SUBMISSION RECEIVED')).toBeVisible();
    await expect(page.locator('text=UNDER REVIEW')).toBeVisible();
  });
});
