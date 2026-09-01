import {test, expect} from '@playwright/test';

test.describe('3. Account Management Flows', () => {

  test('UF-ACCT-01: Update Profile Bio', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('tab', { name: 'Settings' }).click();
    
    const bioTextarea = page.locator('textarea[name="bio"]');
    await expect(bioTextarea).toBeVisible();
    await bioTextarea.fill('This is an updated bio text from automated testing.');
    
    await page.getByRole('button', { name: 'Save Changes' }).first().click();
    await expect(page.locator('.toast, [role="alert"]')).toContainText(/success|updated/i);
  });

  test('UF-ACCT-02: Change Account Password', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('tab', { name: 'Settings' }).click();
    
    const passwordInput = page.locator('input[name="newPassword"]');
    
    // Negative flow - short password
    await passwordInput.fill('short');
    const setPasswordBtn = page.getByRole('button', { name: 'Set password', exact: true });
    await setPasswordBtn.click();
    
    await expect(page.getByText(/Password must be at least 10 characters/i)).toBeVisible();
    
    // Positive flow
    await passwordInput.fill('ValidPassword123!');
    await setPasswordBtn.click();
    
    await expect(page.locator('.toast, [role="alert"]')).toContainText(/successfully/i);
  });
});
