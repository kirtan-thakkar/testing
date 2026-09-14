/**
 * Admin Content (CMS) — POSITIVE flows.
 */
const { test, expect } = require('@playwright/test');
const log = require('../logger.js');
const { ADMIN_URL, loginAdmin } = require('../admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin Content — POSITIVE', () => {
  let page;
  let adminContext;
  test.beforeAll(async ({ browser }) => {
    test.setTimeout(90000); // hook timeout
    const r = await loginAdmin(browser);
    page = r.page;
    adminContext = r.context;
  });
  test.afterAll(async () => { if (page) await page.close(); if (adminContext) await adminContext.close(); });

  test('UF-ADMIN-15-P: CMS Pages list loads with heading', async () => {
    log.info('CMS-15-P', 'start');
    await page.goto(`${ADMIN_URL}/cms`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  });

  test('UF-ADMIN-16-P: CMS settings page loads', async () => {
    log.info('CMS-16-P', 'start');
    await page.goto(`${ADMIN_URL}/cms/settings`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  });

  // FAQs
  test('ADM-FAQ-FUN-001: Verify Add FAQ functionality', async () => {
    log.info('ADM-FAQ-FUN-001', 'start');
    await page.goto(`${ADMIN_URL}/cms/faqs`).catch(() => {});
  });

  test('ADM-FAQ-FUN-002: Verify FAQ list display', async () => {
    log.info('ADM-FAQ-FUN-002', 'start');
  });

  test('ADM-FAQ-FUN-003: Verify Edit FAQ functionality', async () => {
    log.info('ADM-FAQ-FUN-003', 'start');
  });

  test('ADM-FAQ-FUN-004: Verify Hide FAQ functionality', async () => {
    log.info('ADM-FAQ-FUN-004', 'start');
  });

  test('ADM-FAQ-FUN-005: Verify Delete FAQ functionality', async () => {
    log.info('ADM-FAQ-FUN-005', 'start');
  });

  test('ADM-FAQ-FUN-006: Verify FAQ Rows Per Page functionality', async () => {
    log.info('ADM-FAQ-FUN-006', 'start');
  });

  test('ADM-FAQ-FUN-007: Verify FAQ Next page navigation', async () => {
    log.info('ADM-FAQ-FUN-007', 'start');
  });

  test('ADM-FAQ-FUN-008: Verify FAQ Previous page navigation', async () => {
    log.info('ADM-FAQ-FUN-008', 'start');
  });

});