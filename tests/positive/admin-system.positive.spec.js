/**
 * Admin System (Notifications / Activity) — POSITIVE.
 */
const { test, expect } = require('@playwright/test');
const log = require('../logger.js');
const { ADMIN_URL, loginAdmin } = require('../admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin System — POSITIVE', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-ADMIN-17-P: Notifications page loads', async () => {
    log.info('SYS-17-P', 'start');
    await page.goto(`${ADMIN_URL}/notifications`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-18-P: Activity log page loads', async () => {
    log.info('SYS-18-P', 'start');
    await page.goto(`${ADMIN_URL}/activity`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
