import { test, expect } from '@playwright/test';

test.describe('1. Authentication & Registration Flows', () => {
  // We use a clean state for auth flows so we are unauthenticated
  test.use({ storageState: { cookies: [], origins: [] } });

  test('UF-AUTH-01: User Registration and Verification Status', async ({ page }) => {
    await page.goto('https://187.77.79.40.nip.io/register');
    
    // Fill the registration form using strict locators
    await page.locator('input[name="name"]').fill('Test Playwright User');
    await page.locator('input[name="email"]').fill(`test-${Date.now()}@example.com`);
    await page.locator('input[name="password"]').fill('StrongPassword123!');
    
    // Click the Register/Submit button
    const registerBtn = page.getByRole('button', { name: /create|register|sign up/i, exact: false });
    await registerBtn.click();
    
    // The user should be redirected to the dashboard or home
    await page.waitForLoadState('networkidle');
    
    // Navigate to settings to check verification status
    await page.goto('https://187.77.79.40.nip.io/dashboard');
    await page.getByRole('tab', { name: 'Settings' }).click();
    
    // Assert the "Unverified" badge or text exists
    await expect(page.getByText(/unverified/i)).toBeVisible();
  });

  test('UF-AUTH-02: Login - Invalid Credentials (Negative Path)', async ({ page }) => {
    await page.goto('https://187.77.79.40.nip.io/login');
    
    await page.locator('input[name="email"]').fill('thisdoesnotexist123@ideakicks.com');
    await page.locator('input[name="password"]').fill('wrongpass');
    
    await page.getByRole('button', { name: 'Log In' }).click();
    
    // Verify toast notification for invalid credentials
    await expect(page.locator('.toast, [role="alert"]')).toContainText(/invalid/i);
    // User remains on login page
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('UF-AUTH-03: Login - Success (Positive Path)', async ({ page }) => {
    await page.goto('https://187.77.79.40.nip.io/login');
    
    await page.locator('input[name="email"]').fill('kirtanthakkar6@gmail.com');
    await page.locator('input[name="password"]').fill('czBfHbCiMUNpqa4');
    
    await page.getByRole('button', { name: 'Log In' }).click();
    
    await page.waitForLoadState('networkidle');
    
    // The user is logged in if they can access the dashboard
    await page.goto('https://187.77.79.40.nip.io/dashboard');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
