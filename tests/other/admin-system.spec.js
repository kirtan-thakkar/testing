import { test, expect } from '@playwright/test';

test.describe.serial('Admin System Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
    await page.getByRole('textbox', { name: 'Password' }).fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in' }).click({ force: true });
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    if (page) await page.close();
  });

  test('UF-ADMIN-17: Admin View Notifications', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/notifications');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/notifications/);
  });

  test('UF-ADMIN-18: Admin View Activity Log', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/activity');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/activity/);
    await expect(page.locator('body')).toContainText(/admin|system|activity/i);
  });
});
