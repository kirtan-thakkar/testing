/**
 * Admin Engagement (Inbox / Subscribers) — POSITIVE.
 */
const { test, expect } = require('@playwright/test');
const log = require('./logger.js');
const { ADMIN_URL, loginAdmin } = require('./admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin Engagement — POSITIVE', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-ADMIN-13-P: Contact Inbox page loads', async () => {
    log.info('ENG-13-P', 'start');
    await page.goto(`${ADMIN_URL}/inbox`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-14-P: Subscribers page loads', async () => {
    log.info('ENG-14-P', 'start');
    await page.goto(`${ADMIN_URL}/subscribers`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
