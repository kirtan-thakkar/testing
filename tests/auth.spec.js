const { test, expect } = require('@playwright/test');

test.describe('1. Authentication & Registration Flows', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('UF-AUTH-01: User Registration and Verification Status', async ({ page }) => {
    await page.goto('/');
    await page.goto('/register');
    await page.fill('input[name="name"], input[placeholder*="Name"]', 'Test User');
    await page.fill('input[name="email"], input[type="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"], input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await page.click('text=Settings');
    await expect(page.locator('text=Unverified')).toBeVisible();
  });

  test('UF-AUTH-02: Login - Invalid Credentials (Negative Path)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"], input[type="email"]', 'wrong@example.com');
    await page.fill('input[name="password"], input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('UF-AUTH-03: Login - Success (Positive Path)', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"], input[type="email"]', 'valid@example.com');
    await page.fill('input[name="password"], input[type="password"]', 'validpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });
});
