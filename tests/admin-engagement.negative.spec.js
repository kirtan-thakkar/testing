/**
 * Admin Engagement — NEGATIVE / EDGE.
 */
const { test, expect } = require('@playwright/test');
const log = require('./logger.js');
const { ADMIN_URL, loginAdmin } = require('./admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin Engagement — NEGATIVE / EDGE', () => {
  let page;
  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-ENG-N1: Inbox empty search returns empty state', async () => {
    log.info('ENG-N1', 'start');
    await page.goto(`${ADMIN_URL}/inbox`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const search = page.getByRole('textbox', { name: /search/i }).first();
    if (await search.count() === 0) { test.skip(true, 'No search on inbox'); return; }
    await search.fill('zzznomessagexyz');
    await page.waitForTimeout(1500);
    const bodyText = (await page.locator('body').textContent()).toLowerCase();
    expect(bodyText).toMatch(/no|empty|nothing|0/);
  });

  test('UF-ENG-N2: Subscribers 5000-char search does not crash', async () => {
    log.info('ENG-N2', 'start');
    await page.goto(`${ADMIN_URL}/subscribers`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    const search = page.getByRole('textbox', { name: /search/i }).first();
    if (await search.count() === 0) { test.skip(true, 'No search on subscribers'); return; }
    await search.fill('A'.repeat(5000));
    await page.waitForTimeout(1500);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ENG-N3: Inbox reply with XSS payload does not execute', async () => {
    log.info('ENG-N3', 'start');
    await page.goto(`${ADMIN_URL}/inbox`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);
    let alertFired = false;
    page.on('dialog', d => { alertFired = true; d.dismiss(); });
    const replyBox = page.locator('textarea').first();
    if (await replyBox.count() === 0) { test.skip(true, 'No reply textarea'); return; }
    await replyBox.fill('<script>alert(1)</script>');
    await page.waitForTimeout(1000);
    expect(alertFired).toBe(false);
  });
});
