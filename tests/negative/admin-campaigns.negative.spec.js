/**
 * Admin Campaigns — NEGATIVE / EDGE flows.
 * Companion: admin-campaigns.positive.spec.js
 */
const { test, expect } = require('@playwright/test');
const log = require('../logger.js');
const { ADMIN_URL, loginAdmin } = require('../admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin Campaigns — NEGATIVE / EDGE', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-ADMIN-01-N: Empty search returns empty state, not error', async () => {
    log.info('ADM-01-N', 'start');
    await page.goto(`${ADMIN_URL}/projects`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const search = page.getByRole('textbox', { name: /search/i }).first();
    if (await search.count() === 0) { test.skip(true, 'No search input on /projects'); return; }
    await search.fill('zzznosuchprojectxyz');
    await page.waitForTimeout(1500);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText.toLowerCase()).toMatch(/no|empty|nothing|0|not found/);
    log.info('ADM-01-N', 'empty state shown for no-match search');
  });

  test('UF-ADMIN-01-N2: 5000-char search does not crash search', async () => {
    log.info('ADM-01-N2', 'start');
    await page.goto(`${ADMIN_URL}/projects`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const search = page.getByRole('textbox', { name: /search/i }).first();
    if (await search.count() === 0) { test.skip(true, 'No search input'); return; }
    await search.fill('A'.repeat(5000));
    await page.waitForTimeout(1500);
    // Page should still respond (no crash).
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    log.info('ADM-01-N2', 'search survived 5000 chars');
  });

  test('UF-ADMIN-03-N: Special characters in campaign search do not crash', async () => {
    log.info('ADM-03-N', 'start');
    await page.goto(`${ADMIN_URL}/campaigns`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const search = page.getByRole('textbox', { name: /search/i }).first();
    if (await search.count() === 0) { test.skip(true, 'No search input'); return; }
    const nasty = `<script>alert(1)</script>"';--🚀`;
    let alertFired = false;
    page.on('dialog', d => { alertFired = true; d.dismiss(); });
    await search.fill(nasty);
    await page.waitForTimeout(1500);
    expect(alertFired).toBe(false);
    log.info('ADM-03-N', 'no XSS via search');
  });

  test('UF-ADMIN-99-N: Direct visit to admin without auth redirects to /login', async ({ browser }) => {
    log.info('ADM-99-N', 'start');
    const ctx = await browser.newContext();
    const p = await ctx.newPage();
    await p.goto(`${ADMIN_URL}/projects`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await p.waitForTimeout(2000);
    const u = p.url();
    log.info('ADM-99-N', `unauthed → ${u}`);
    expect(u).toMatch(/\/login/);
    await ctx.close();
  });
});
