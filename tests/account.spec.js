const { test, expect } = require('@playwright/test');

test.describe('3. Account Management Flows', () => {

  test('UF-ACCT-01: Update Profile Bio', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=Settings');
    await page.fill('textarea[name="bio"]', 'Updated bio text');
    await page.click('button:has-text("Save Changes")');
    await expect(page.locator('text=Success')).toBeVisible();
  });

  test('UF-ACCT-02: Change Account Password', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('text=Settings');
    
    // Negative flow
    await page.fill('input[name="newPassword"]', 'short');
    await page.click('button:has-text("Set password")');
    await expect(page.locator('text=Password must be at least 10 characters')).toBeVisible();
    
    // Positive flow
    await page.fill('input[name="newPassword"]', 'ValidPassword123!');
    await page.click('button:has-text("Set password")');
    await expect(page.locator('text=successfully')).toBeVisible();
  });
});
