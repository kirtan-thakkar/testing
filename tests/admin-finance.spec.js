import { test, expect } from '@playwright/test';

test.describe('Admin Finance Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.locator('input[name="email"]').fill('hello@ideakicks.com');
    await page.locator('input[name="password"]').fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await page.waitForLoadState('networkidle');
  });

  test('UF-ADMIN-07: Admin View Payouts', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/finance/payouts');
    await page.getByRole('combobox', { name: '' }).selectOption({ label: '' });
    await expect(page).toHaveURL(/.*status=processing/i);
  });

  test('UF-ADMIN-08: Admin Manage Pledges and Refunds', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/finance/pledges');
    
    const firstCampaignLink = page.getByRole('link', { name: /open/i }).first();
    await firstCampaignLink.click();
    
    await page.getByRole('button', { name: 'Refund', exact: true }).first().click();
    
    const confirmRefundBtn = page.getByRole('button', { name: 'Refund', exact: true }).last();
    await expect(confirmRefundBtn).toBeDisabled();
    
    await page.locator('textarea').fill('Requested by backer due to duplicate charge');
    await expect(confirmRefundBtn).toBeEnabled();
    
    // We cancel so we don't refund actual staging money
    await page.getByRole('button', { name: 'Cancel', exact: true }).click({ force: true });
  });

  test('UF-ADMIN-09: Admin View Refunds Log', async ({ page }) => {
    await page.goto('https://admin.187.77.79.40.nip.io/finance/refunds');
    await page.getByRole('combobox', { name: '' }).selectOption({ label: '' });
  });
});



