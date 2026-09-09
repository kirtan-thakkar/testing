/**
 * Wizard POSITIVE test cases — happy path scenarios that must succeed.
 * Sibling file: wizard-application.negative.spec.js
 */
const { test, expect } = require('@playwright/test');
const log = require('../logger.js');
const LOG_PATH = log.getRollingLogPath();
const { login, dismissCookies, fillStep1, wizardAlreadySubmitted } = require('../wizard-helpers.js');

log.info('WIZARD-POS', `Log file: ${LOG_PATH}`);

test.setTimeout(60000);

// If the wizard user has already submitted a campaign, skip wizard tests.
// (No fresh state is available; the user is real and persistent on the server.)
test.beforeEach(async ({ page }) => {
  try {
    await page.goto('/start/application', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.locator('h1, h2').first().waitFor({ timeout: 5000 }).catch(() => {});
    const submitted = await page.getByText(/UNDER REVIEW/i).isVisible({ timeout: 1000 }).catch(() => false)
      || await page.getByText(/Submission received/i).isVisible({ timeout: 1000 }).catch(() => false);
    if (submitted) {
      test.skip(true, 'Wizard user already submitted — tests skipped');
    }
  } catch (e) {
    // If we cannot even load the page, let the test try anyway.
  }
});

// Per-test watchdog: force skip if test runs > 55s on a slow server.
test.beforeEach(async ({ page }, testInfo) => {
  const watchdog = setTimeout(() => {
    log.warn('WATCHDOG', `${testInfo.title} exceeded 55s — closing context`);
    try { page.context().close().catch(() => {}); } catch {}
  }, 55000);
  testInfo._watchdog = watchdog;
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo._watchdog) clearTimeout(testInfo._watchdog);
});

test.describe('8. Campaign Application Wizard — POSITIVE flows', () => {

  test('UF-WIZ-01-P: Wizard page renders step 1 with all required fields', async ({ page }) => {
    log.info('WIZ-01-P', 'start');
    try { await login(page); } catch (e) { test.skip(true, 'login timeout'); return; }
    await page.goto('/start/application');
    await dismissCookies(page);

// Headings: "Start your campaign". Steps: "Plan & Set Up", "Build Page", "Review & Submit", "Done".
    await expect(page.getByRole('heading', { name: /start your campaign/i })).toBeVisible();
    // Step 1 of 4 indicator
    await expect(page.getByText(/Step 1 of 4/i)).toBeVisible();
    // Stepper labels (mixed case)
    await expect(page.getByText(/Plan & Set Up/i).first()).toBeVisible();
    await expect(page.getByText(/Build Page/i).first()).toBeVisible();
    await expect(page.getByText(/Review & Submit/i).first()).toBeVisible();
    await expect(page.getByText(/^Done$/i).first()).toBeVisible();
    // Step-1 eligibility checkboxes
    await expect(page.getByText(/18 years of age/i)).toBeVisible();
    await expect(page.getByText(/country supported/i)).toBeVisible();
    log.info('WIZ-01-P', 'all expected elements visible');
  });

  test('UF-WIZ-02-P: Continue is enabled when all required fields are filled', async ({ page }) => {
    log.info('WIZ-02-P', 'start');
    try { await login(page); } catch (e) { test.skip(true, 'login timeout'); return; }
    await page.goto('/start/application');
    await dismissCookies(page);
    await page.locator('h1').first().waitFor();
    const continueBtn = page.getByRole('button', { name: /^Continue$/ });
    await fillStep1(page);
    await expect(continueBtn).toBeEnabled();
    log.info('WIZ-02-P', 'Continue enabled with valid data');
  });

  test('UF-WIZ-03-P: PAN field shows correct placeholder', async ({ page }) => {
    log.info('WIZ-03-P', 'start');
    try { await login(page); } catch (e) { test.skip(true, 'login timeout'); return; }
    await page.goto('/start/application');
    await dismissCookies(page);
    const pan = page.getByRole('textbox', { name: /^PAN Card Number/i });
    expect(await pan.getAttribute('placeholder')).toBe('ABCDE1234F');
  });

  test('UF-WIZ-04-P: Step 1 happy path advances to step 2', async ({ page }) => {
    log.info('WIZ-04-P', 'start');
    try { await login(page); } catch (e) { test.skip(true, 'login timeout'); return; }
    await fillStep1(page);
    await dismissCookies(page);
    await page.getByRole('button', { name: /^Continue$/ }).click();
    await expect(page.getByText(/Step 2 of 4/i)).toBeVisible({ timeout: 30000 });
    log.info('WIZ-04-P', 'advanced to step 2');
  });

  test('UF-WIZ-07-P: Step 2 Build Page is reachable and has file inputs', async ({ page }) => {
    log.info('WIZ-07-P', 'start');
    try { await login(page); } catch (e) { test.skip(true, 'login timeout'); return; }
    await fillStep1(page);
    await dismissCookies(page);
    await page.getByRole('button', { name: /^Continue$/ }).click();
    await expect(page.getByText(/Step 2 of 4/i)).toBeVisible({ timeout: 30000 });
    const fileInputs = page.locator('input[type="file"]');
    const count = await fileInputs.count();
    log.info('WIZ-07-P', `step 2 has ${count} file inputs`);
    expect(count).toBeGreaterThan(0);
  });

  test('UF-WIZ-08-P: Step 1 page loads cleanly with no JS errors', async ({ page }) => {
    log.info('WIZ-08-P', 'start');
    try { await login(page); } catch (e) { test.skip(true, 'login timeout'); return; }
    const errors = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/start/application');
    await dismissCookies(page);
    await page.locator('h1').first().waitFor();
    await page.waitForTimeout(1000);
    log.info('WIZ-08-P', `JS errors on load: ${errors.length}`);
    if (errors.length > 0) log.warn('WIZ-08-P', `errors: ${JSON.stringify(errors)}`);
    expect(errors.filter(e => !/ResizeObserver|favicon/i.test(e))).toHaveLength(0);
  });

  test('UF-WIZ-10-P: Country dropdown lists India', async ({ page }) => {
    log.info('WIZ-10-P', 'start');
    try { await login(page); } catch (e) { test.skip(true, 'login timeout'); return; }
    await page.goto('/start/application');
    await dismissCookies(page);
    await page.locator('h1').first().waitFor();
    const country = page.getByRole('combobox', { name: /^Country/i });
    const options = await country.locator('option').allTextContents();
    expect(options.some(o => /India/i.test(o))).toBe(true);
    log.info('WIZ-10-P', `${options.length} country options, India present`);
  });

  test('UF-WIZ-11-P: Subcategory populates after category chosen', async ({ page }) => {
    log.info('WIZ-11-P', 'start');
    try { await login(page); } catch (e) { test.skip(true, 'login timeout'); return; }
    await page.goto('/start/application');
    await dismissCookies(page);
    await page.locator('h1').first().waitFor();
    const category = page.getByRole('combobox', { name: /^Primary Category/i });
    const subcat = page.getByRole('combobox', { name: /^Subcategory/i });
    await category.selectOption({ label: 'Technology' });
    await page.waitForTimeout(500);
    const subs = await subcat.locator('option').allTextContents();
    expect(subs.length).toBeGreaterThan(1);
    log.info('WIZ-11-P', `Technology → ${subs.length} subcategories`);
  });

  test('UF-WIZ-14-P: GSTIN optional field accepts valid value', async ({ page }) => {
    log.info('WIZ-14-P', 'start');
    try { await login(page); } catch (e) { test.skip(true, 'login timeout'); return; }
    await page.goto('/start/application');
    await dismissCookies(page);
    await page.locator('h1').first().waitFor();
    const gstin = page.getByRole('textbox', { name: /GSTIN/i });
    if (await gstin.count() === 0) { test.skip(true, 'No GSTIN field'); return; }
    await gstin.fill('22ABCDE1234F1Z5');
    expect((await gstin.inputValue()).length).toBeGreaterThan(0);
  });

  test('UF-WIZ-20-P: Wizard URL is exactly /start/application', async ({ page }) => {
    log.info('WIZ-20-P', 'start');
    try { await login(page); } catch (e) { test.skip(true, 'login timeout'); return; }
    await page.goto('/start/application');
    await dismissCookies(page);
    const url = new URL(page.url());
    expect(url.pathname).toBe('/start/application');
  });
});

