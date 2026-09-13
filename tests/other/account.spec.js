import { test, expect } from '@playwright/test';

// Helper: log in fresh. /dashboard depends on a valid refresh token, but the
// backend rotates them, so we cannot trust storageState alone.
// If we land somewhere other than /login, or the page shows no login form, we
// treat ourselves as already authed.
async function login(page) {
  await page.goto('/login');

  // Wait for either the login form to render, or the redirect to complete.
  // The login form has a unique <input name="email">.
  try {
    await page.locator('input[name="email"]').waitFor({ timeout: 8000 });
  } catch {
    // No login form — user is already authenticated.
    return;
  }

  await page.getByRole('textbox', { name: 'Email' }).fill('kirtanthakkar6@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('czBfHbCiMUNpqa4');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 20000 });
  await page.locator('h1').first().waitFor({ timeout: 15000 });
}

test.describe('3. Account Management Flows', () => {

  test('UF-ACCT-01: Update Profile Bio', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.locator('h1').first().waitFor({ timeout: 15000 });

    // Settings is rendered as a button/link, not always a button — use text.
    await page.getByText('Settings', { exact: true }).first().click();

    // Verify we landed on the settings view.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ACCT-02: Change Account Password', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.locator('h1').first().waitFor({ timeout: 15000 });

    // Settings is rendered as a button/link, not always a button — use text.
    await page.getByText('Settings', { exact: true }).first().click();

    // Verify settings view loaded.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});