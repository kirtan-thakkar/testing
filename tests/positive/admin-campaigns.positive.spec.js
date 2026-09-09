/**
 * Admin Campaigns — POSITIVE flows.
 * Companion: admin-campaigns.negative.spec.js
 */
const { test, expect } = require('@playwright/test');
const log = require('../logger.js');
const { ADMIN_URL, loginAdmin } = require('../admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin Campaigns — POSITIVE', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-ADMIN-01-P: Project Submissions page loads with heading', async () => {
    log.info('ADM-01-P', 'start');
    await page.goto(`${ADMIN_URL}/projects`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/projects/);
    log.info('ADM-01-P', 'ok');
  });

  test('UF-ADMIN-02-P: Project Submissions filter UI is present', async () => {
    log.info('ADM-02-P', 'start');
    await page.goto(`${ADMIN_URL}/projects`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    // Look for at least one filter-like control.
    const filterControls = await page.locator('select, button:has-text("Filter"), [role="combobox"]').count();
    log.info('ADM-02-P', `filter controls: ${filterControls}`);
    expect(filterControls).toBeGreaterThan(0);
  });

  test('UF-ADMIN-03-P: Campaigns list page loads', async () => {
    log.info('ADM-03-P', 'start');
    await page.goto(`${ADMIN_URL}/campaigns`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/campaigns/);
  });

  test('UF-ADMIN-04-P: Categories page loads', async () => {
    log.info('ADM-04-P', 'start');
    await page.goto(`${ADMIN_URL}/categories`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-05-P: Country Fields (Application Fields) page loads', async () => {
    log.info('ADM-05-P', 'start');
    await page.goto(`${ADMIN_URL}/country-fields`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-06-P: Partners page loads', async () => {
    log.info('ADM-06-P', 'start');
    await page.goto(`${ADMIN_URL}/partners`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
