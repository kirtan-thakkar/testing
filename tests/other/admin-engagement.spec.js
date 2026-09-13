import { test, expect } from '@playwright/test';

test.describe.serial('Admin Engagement Section', () => {
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

  test('UF-ADMIN-13: Admin Manage Contact Inbox', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/inbox');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/inbox/);
  });

  test('UF-ADMIN-14: Admin View Subscribers', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/subscribers');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/subscribers/);
  });
});
