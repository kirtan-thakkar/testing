import { test, expect } from '@playwright/test';

test.describe.serial('Test Admin Shared Page', () => {
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

  test('Test 1: Roles', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/roles');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Roles & Permissions' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'New role' })).toBeVisible();
  });

  test('Test 2: Users', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/users');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'User Management' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'New user' })).toBeVisible();
  });

  test('Test 3: Campaigns', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/campaigns');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Campaigns' })).toBeVisible();
  });
});
