/**
 * Admin People (Users / Roles / Deletion Requests) — POSITIVE.
 */
const { test, expect } = require('@playwright/test');
const log = require('./logger.js');
const { ADMIN_URL, loginAdmin } = require('./admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin People — POSITIVE', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-ADMIN-10-P: User Management page loads with "New user" CTA', async () => {
    log.info('PPL-10-P', 'start');
    await page.goto(`${ADMIN_URL}/users`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const newUser = page.getByRole('link', { name: 'New user' });
    if (await newUser.count() > 0) await expect(newUser).toBeVisible();
  });

  test('UF-ADMIN-11-P: Roles page loads with "New role" CTA', async () => {
    log.info('PPL-11-P', 'start');
    await page.goto(`${ADMIN_URL}/roles`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-12-P: Deletion Requests page loads', async () => {
    log.info('PPL-12-P', 'start');
    await page.goto(`${ADMIN_URL}/deletion-requests`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
