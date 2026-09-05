/**
 * Admin System — NEGATIVE / EDGE.
 */
const { test, expect } = require('@playwright/test');
const log = require('./logger.js');
const { ADMIN_URL, loginAdmin } = require('./admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin System — NEGATIVE / EDGE', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-SYS-N1: Notifications page with no JS errors on load', async () => {
    log.info('SYS-N1', 'start');
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(`${ADMIN_URL}/notifications`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const real = errors.filter(e => !/ResizeObserver|favicon/i.test(e));
    log.info('SYS-N1', `JS errors: ${real.length}`);
    expect(real).toHaveLength(0);
  });

  test('UF-SYS-N2: Activity log filter with junk date does not crash', async () => {
    log.info('SYS-N2', 'start');
    await page.goto(`${ADMIN_URL}/activity`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.count() === 0) { test.skip(true, 'No date filter'); return; }
    await dateInput.fill('not-a-date');
    await page.waitForTimeout(800);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-SYS-N3: 5000-char search on activity log does not crash', async () => {
    log.info('SYS-N3', 'start');
    await page.goto(`${ADMIN_URL}/activity`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const search = page.getByRole('textbox', { name: /search/i }).first();
    if (await search.count() === 0) { test.skip(true, 'No search'); return; }
    await search.fill('A'.repeat(5000));
    await page.waitForTimeout(1500);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
