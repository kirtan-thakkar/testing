/**
 * Admin Content (CMS) — POSITIVE flows.
 */
const { test, expect } = require('@playwright/test');
const log = require('./logger.js');
const { ADMIN_URL, loginAdmin } = require('./admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin Content — POSITIVE', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-ADMIN-15-P: CMS Pages list loads with heading', async () => {
    log.info('CMS-15-P', 'start');
    await page.goto(`${ADMIN_URL}/cms`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-16-P: CMS settings page loads', async () => {
    log.info('CMS-16-P', 'start');
    await page.goto(`${ADMIN_URL}/cms/settings`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
