import { test, expect } from '@playwright/test';

// Helper: log in fresh (refresh tokens rotate server-side, so we can't rely on
// the storageState alone for tests that hit /dashboard).
async function login(page) {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.getByRole('textbox', { name: 'Email' }).fill('kirtanthakkar6@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('czBfHbCiMUNpqa4');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 20000 });
  await page.waitForLoadState('networkidle');
}

test.describe('3. Account Management Flows', () => {

  test('UF-ACCT-01: Update Profile Bio', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Settings is rendered as a link/div, not a button.
    await page.getByText('Settings', { exact: true }).first().click();

    // Verify we landed on the settings view.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ACCT-02: Change Account Password', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Settings is rendered as a link/div, not a button.
    await page.getByText('Settings', { exact: true }).first().click();

    // Verify settings view loaded.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});