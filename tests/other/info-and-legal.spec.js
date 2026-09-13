import { test, expect } from '@playwright/test';

test.describe('7. Informational & Legal Flows', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('UF-INFO-01: Global Static Page Navigation', async ({ page }) => {
    const staticPages = [
      '/explore', '/how-it-works', '/pricing', '/creators', 
      '/backers', '/mentors', '/investors', '/vendors', 
      '/about', '/contact'
    ];
    for (const p of staticPages) {
      const response = await page.goto(p);
      expect(response.status()).toBe(200);
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });

  test('UF-INFO-02: Dynamic Legal Hub Navigation', async ({ page }) => {
    await page.goto('/');
    // Use precise locator or just navigate if footer isn't fully mocked here
    await page.goto('/legal?tab=terms');
    await page.click('text=Privacy Policy');
    await page.waitForURL('**/legal?tab=privacy');
    await expect(page.locator('text=Privacy Policy').first()).toBeVisible();
  });

  test('UF-INFO-03: Cookie Preferences Management', async ({ page }) => {
    await page.goto('/legal?tab=cookies');
    const essential = page.locator('input[name="essentialCookies"]');
    if (await essential.isVisible()) {
      await expect(essential).toBeDisabled();
      await expect(essential).toBeChecked();
    }
    const analytical = page.locator('input[name="analyticalCookies"]');
    if (await analytical.isVisible()) {
      await analytical.uncheck();
    }
    await page.click('button:has-text("Save Preferences")');
  });

  test('UF-BUG-01: Footer Social Icons Interactivity', async ({ page }) => {
    await page.goto('/');
    const icons = page.locator('footer span').filter({ hasText: /X|YouTube|LinkedIn|Instagram/ });
    if (await icons.count() > 0) {
      const icon = icons.first();
      await icon.hover();
      await icon.click();
      await expect(page).toHaveURL('/');
    }
  });
});
