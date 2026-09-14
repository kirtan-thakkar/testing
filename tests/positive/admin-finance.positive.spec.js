/**
 * Admin Finance (Payouts / Pledges / Refunds) — POSITIVE.
 */
const { test, expect } = require('@playwright/test');
const log = require('../logger.js');
const { ADMIN_URL, loginAdmin } = require('../admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin Finance — POSITIVE', () => {
  let page;
  let adminContext;
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(90000); // hook timeout
    const r = await loginAdmin(browser);
    page = r.page;
    adminContext = r.context;
  });
  test.afterAll(async () => { if (page) await page.close(); if (adminContext) await adminContext.close(); });

  test('UF-ADMIN-07-P: Payouts page loads', async () => {
    log.info('FIN-07-P', 'start');
    await page.goto(`${ADMIN_URL}/finance/payouts`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-08-P: Pledges page loads', async () => {
    log.info('FIN-08-P', 'start');
    await page.goto(`${ADMIN_URL}/finance/pledges`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-09-P: Refunds log page loads', async () => {
    log.info('FIN-09-P', 'start');
    await page.goto(`${ADMIN_URL}/finance/refunds`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
