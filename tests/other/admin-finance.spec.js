import { test, expect } from '@playwright/test';

test.describe.serial('Admin Finance Section', () => {
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

  test('UF-ADMIN-07: Admin View Payouts', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/finance/payouts');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/finance\/payouts/);
  });

  test('UF-ADMIN-08: Admin Manage Pledges', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/finance/pledges');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/finance\/pledges/);
  });

  test('UF-ADMIN-09: Admin View Refunds Log', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/finance/refunds');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/finance\/refunds/);
  });
});
