const { test, expect } = require('@playwright/test');

test.describe('3. Account Management Flows', () => {

  test('UF-ACCT-01: Update Profile Bio', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('tab', { name: 'Settings' }).click();
    
    // Check if there is a form field for bio
    const bioTextarea = page.locator('textarea[name="bio"]');
    await expect(bioTextarea).toBeVisible();
    await bioTextarea.fill('This is an updated bio text from automated testing.');
    
    // Assume a "Save Changes" button
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    await expect(page.locator('text=Success')).toBeVisible();
  });

  test('UF-ACCT-02: Change Account Password', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('tab', { name: 'Settings' }).click();
    
    // Negative flow
    await page.locator('input[name="newPassword"]').fill('short');
    await page.getByRole('button', { name: 'Set password' }).click();
    await expect(page.locator('text=Password must be at least 10 characters')).toBeVisible();
    
    // Positive flow
    await page.locator('input[name="newPassword"]').fill('ValidPassword123!');
    await page.getByRole('button', { name: 'Set password' }).click();
    await expect(page.locator('text=successfully')).toBeVisible();
  });
});
