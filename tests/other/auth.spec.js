import { test, expect } from '@playwright/test';

test.describe('1. Authentication & Registration Flows', () => {
  // We use a clean state for auth flows so we are unauthenticated
  test.use({ storageState: { cookies: [], origins: [] } });

  test('UF-AUTH-01: User Registration Page Loads', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    
    // Verify the registration page renders with its form elements
    await expect(page.getByRole('heading', { name: /create|register|sign up/i })).toBeVisible();
  });

  test('UF-AUTH-02: Login - Invalid Credentials (Negative Path)', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('textbox', { name: 'Email' }).fill('thisdoesnotexist123@ideakicks.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpass');
    
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForLoadState('networkidle');
    
    // User remains on login page (not redirected)
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('UF-AUTH-03: Login - Success (Positive Path)', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.getByRole('textbox', { name: 'Email' }).fill('kirtanthakkar6@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('czBfHbCiMUNpqa4');
    
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForLoadState('networkidle');
    
    // The user is redirected away from login (to / or /dashboard)
    await expect(page).not.toHaveURL(/.*\/login/);
  });
});
