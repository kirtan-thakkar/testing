import { test, expect } from '@playwright/test';

// Helper: log in fresh. /dashboard depends on a valid refresh token, but the
// backend rotates them, so we cannot trust storageState alone.
async function login(page) {
  await page.goto('/login');
  try {
    await page.locator('input[name="email"]').waitFor({ timeout: 8000 });
  } catch {
    return; // Already authed.
  }
  await page.getByRole('textbox', { name: 'Email' }).fill('kirtanthakkar6@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('czBfHbCiMUNpqa4');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 20000 });
  await page.locator('h1').first().waitFor({ timeout: 15000 });
}

test.describe('Dashboard specific flows', () => {
  test('UF-DASH-01: Creator Dashboard Tabs Navigation', async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
    await page.locator('h1').first().waitFor({ timeout: 15000 });

    // Verify dashboard heading rendered.
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Dashboard tabs are rendered as buttons/links.
    await page.getByText('Backed Projects', { exact: true }).first().click();
    await page.getByText('Saved', { exact: true }).first().click();
    await page.getByText('My Campaigns', { exact: true }).first().click();
    await page.getByText('Overview', { exact: true }).first().click();
  });
});