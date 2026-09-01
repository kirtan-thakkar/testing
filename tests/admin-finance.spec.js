const { test, expect } = require('@playwright/test');

test.describe('Admin Finance Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.getByLabel('Email address').fill('hello@ideakicks.com');
    await page.getByLabel('Password').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('UF-ADMIN-07: Admin View Payouts', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/finance/payouts');
    await expect(page.locator('table')).toBeVisible();
    
    await page.getByRole('combobox', { name: 'Filter by status' }).click();
    await page.getByRole('option', { name: 'Processing' }).click();
    await expect(page).toHaveURL(/.*status=processing/i);
  });

  test('UF-ADMIN-08: Admin Manage Pledges and Refunds', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/finance/pledges');
    
    const firstCampaignLink = page.getByRole('link', { name: /open/i }).first();
    await firstCampaignLink.click();
    
    await expect(page.locator('table')).toBeVisible();
    
    await page.getByRole('button', { name: 'Refund', exact: true }).first().click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    const confirmRefundBtn = dialog.getByRole('button', { name: 'Refund', exact: true });
    await expect(confirmRefundBtn).toBeDisabled();
    
    await dialog.locator('textarea').fill('Requested by backer due to duplicate charge');
    await expect(confirmRefundBtn).toBeEnabled();
    
    // We cancel so we don't refund actual staging money
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click({ force: true });
  });

  test('UF-ADMIN-09: Admin View Refunds Log', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/finance/refunds');
    await expect(page.locator('table')).toBeVisible();
    
    await page.getByRole('combobox', { name: 'Filter by status' }).click();
    await page.getByRole('option', { name: 'Succeeded' }).click();
  });
});
