const { test, expect } = require('@playwright/test');

test.describe('Admin Authentication', () => {
  // Use a fresh context for admin auth testing, isolated from global state
  test.use({ storageState: { cookies: [], origins: [] } });

  test('ADM-AUTH-FUN-001: Login with valid admin credentials', async ({ page }) => {
    // 1. Navigate to the Admin login page.
    await page.goto('https://admin.187.77.79.40.nip.io/login');

    // 2. Enter valid Admin email.
    await page.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');

    // 3. Enter valid Admin password.
    await page.getByRole('textbox', { name: 'Password' }).fill(`r9Ff{A0Z'kY:{V1W`);

    // 4. Click the Login button. (Note: standard button says 'Sign in' based on earlier tests)
    await page.getByRole('button', { name: /Sign in|Login/i }).click();

    // Expected: 3. Admin is redirected to the Admin Dashboard.
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByRole('heading', { name: /Welcome/i }).first()).toBeVisible();
  });
});
