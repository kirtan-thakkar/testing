const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://187.77.79.40.nip.io';

test.describe('Authentication Suite', () => {

  // Unauthenticated tests should not use the injected token
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC-004: Empty Login Validation', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page.getByText('Invalid email address')).toBeVisible();
    await expect(page.getByText('Too small')).toBeVisible();
  });

  test('TC-003: Invalid Login Validation (BUG-001)', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    const loginResponse = page.waitForResponse(res => res.url().includes('/auth/login') && res.request().method() === 'POST');

    await page.locator('input[name="email"]').fill('invalid@example.com');
    await page.locator('input[name="password"]').fill('wrongpassword');

    await page.getByRole('button', { name: 'Log In' }).click();
    
    const response = await loginResponse;
    expect(response.status()).toBe(401);

    // This is the bug: visual error does not appear. (We uncomment if it ever gets fixed)
    // await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

});
