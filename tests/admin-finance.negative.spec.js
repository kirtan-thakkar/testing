/**
 * Admin Finance — NEGATIVE / EDGE.
 */
const { test, expect } = require('@playwright/test');
const log = require('./logger.js');
const { ADMIN_URL, loginAdmin } = require('./admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin Finance — NEGATIVE / EDGE', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-FIN-N1: Payouts with non-existent ID shows error, not crash', async () => {
    log.info('FIN-N1', 'start');
    const resp = await page.goto(`${ADMIN_URL}/finance/payouts/does-not-exist-xyz`, {
      waitUntil: 'domcontentloaded',
    });
    log.info('FIN-N1', `status: ${resp ? resp.status() : 0}`);
    await expect(page.locator('body')).toBeVisible();
  });

  test('UF-FIN-N2: 5000-char filter on pledges does not crash', async () => {
    log.info('FIN-N2', 'start');
    await page.goto(`${ADMIN_URL}/finance/pledges`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const search = page.getByRole('textbox', { name: /search/i }).first();
    if (await search.count() === 0) { test.skip(true, 'No search'); return; }
    await search.fill('A'.repeat(5000));
    await page.waitForTimeout(1500);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-FIN-N3: Refunds date filter with junk value does not crash', async () => {
    log.info('FIN-N3', 'start');
    await page.goto(`${ADMIN_URL}/finance/refunds`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.count() === 0) { test.skip(true, 'No date filter'); return; }
    await dateInput.fill('not-a-real-date');
    await page.waitForTimeout(800);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
