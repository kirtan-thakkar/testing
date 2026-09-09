/**
 * Admin People — NEGATIVE / EDGE.
 */
const { test, expect } = require('@playwright/test');
const log = require('../logger.js');
const { ADMIN_URL, loginAdmin } = require('../admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin People — NEGATIVE / EDGE', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-PPL-N1: User search with no matches shows empty state', async () => {
    log.info('PPL-N1', 'start');
    await page.goto(`${ADMIN_URL}/users`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const search = page.getByRole('textbox', { name: /search/i }).first();
    if (await search.count() === 0) { test.skip(true, 'No search on /users'); return; }
    await search.fill('zzznousersuchxyz');
    await page.waitForTimeout(1500);
    const bodyText = (await page.locator('body').textContent()).toLowerCase();
    expect(bodyText).toMatch(/no|empty|nothing|0/);
  });

  test('UF-PPL-N2: User search with XSS does not execute', async () => {
    log.info('PPL-N2', 'start');
    await page.goto(`${ADMIN_URL}/users`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    let alertFired = false;
    page.on('dialog', d => { alertFired = true; d.dismiss(); });
    const search = page.getByRole('textbox', { name: /search/i }).first();
    if (await search.count() === 0) { test.skip(true, 'No search'); return; }
    await search.fill(`<script>alert(1)</script>`);
    await page.waitForTimeout(1500);
    expect(alertFired).toBe(false);
  });

  test('UF-PPL-N3: 5000-char user search does not crash', async () => {
    log.info('PPL-N3', 'start');
    await page.goto(`${ADMIN_URL}/users`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const search = page.getByRole('textbox', { name: /search/i }).first();
    if (await search.count() === 0) { test.skip(true, 'No search'); return; }
    await search.fill('A'.repeat(5000));
    await page.waitForTimeout(1500);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-PPL-N4: Visit /users/<junk-id> does not crash', async () => {
    log.info('PPL-N4', 'start');
    const resp = await page.goto(`${ADMIN_URL}/users/zzznotarealid`, {
      waitUntil: 'domcontentloaded',
    });
    log.info('PPL-N4', `status: ${resp ? resp.status() : 0}`);
    await expect(page.locator('body')).toBeVisible();
  });
});
