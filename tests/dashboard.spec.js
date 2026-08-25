const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://187.77.79.40.nip.io';

test.describe('Dashboard & Settings Suite', () => {
  // NOTE: Requires authenticated user

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
  });

  test('TC-009: Update Profile Bio in Settings', async ({ page }) => {
    // Navigate to Settings tab
    await page.getByRole('button', { name: 'Settings' }).click();

    // Verify Profile heading
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();

    // Update Bio
    // Use the textarea for Bio. (Using locator('textarea') based on exploration)
    const bioTextarea = page.locator('textarea').first();
    await bioTextarea.fill('Hello this is my updated bio from Playwright!');

    // Save Changes and verify network request
    const patchRequestPromise = page.waitForResponse(res => res.url().includes('/me') && res.request().method() === 'PATCH');
    await page.getByRole('button', { name: 'Save Changes' }).click();

    const patchResponse = await patchRequestPromise;
    expect(patchResponse.status()).toBe(200);
  });

  test('TC-010: Invalid Password Change Validation', async ({ page }) => {
    // Navigate to Settings tab
    await page.getByRole('button', { name: 'Settings' }).click();

    // Find Password section fields
    await page.getByRole('textbox', { name: 'New password', exact: true }).fill('short');
    await page.getByRole('textbox', { name: 'Confirm new password' }).fill('short');

    // Click Set password
    await page.getByRole('button', { name: 'Set password' }).click();

    // Verify inline validation error
    await expect(page.getByText('Password must be at least 10 characters')).toBeVisible();
  });

});
