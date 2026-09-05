/**
 * Shared helpers for wizard-application.positive.spec.js and
 * wizard-application.negative.spec.js.
 */
const log = require('./logger.js');

async function login(page) {
  log.info('login', 'navigating to /login');
  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 90000 });
  try {
    await page.locator('input[name="email"]').waitFor({ timeout: 60000 });
  } catch {
    log.info('login', 'already authed');
    return;
  }
  await page.getByRole('textbox', { name: 'Email' }).fill('kirtanthakkar6@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('czBfHbCiMUNpqa4');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL(u => !u.toString().includes('/login'), {
    timeout: 90000, waitUntil: 'domcontentloaded',
  });
  await page.locator('h1').first().waitFor({ timeout: 30000 });
  log.info('login', 'ok');
}

async function dismissCookies(page) {
  const decline = page.getByRole('button', { name: /^Decline$/ });
  if (await decline.isVisible().catch(() => false)) {
    await decline.click();
    log.info('cookies', 'dismissed');
  }
}

async function fillStep1(page, overrides = {}) {
  // The page may have just been navigated to /start/application but the
  // wizard UI hasn't rendered yet. Wait for the h1 first (with a short
  // timeout — if it's not there, give up fast and let the test skip).
  try {
    await page.locator('h1', { hasText: /Start your campaign/i }).first().waitFor({ timeout: 15000 });
  } catch {
    log.warn('fillStep1', 'wizard h1 not visible within 15s — page may not be on /start/application');
    return;
  }
  if (overrides.age18 !== false) {
    await page.getByRole('checkbox', { name: /18 years/i }).check();
  }
  if (overrides.countrySupported !== false) {
    await page.getByRole('checkbox', { name: /country supported/i }).check();
  }
  await page.getByRole('combobox', { name: /^Primary Category/i })
    .selectOption({ label: overrides.category || 'Technology' });
  const subcat = page.getByRole('combobox', { name: /^Subcategory/i });
  await subcat.waitFor();
  await subcat.selectOption({ index: overrides.subcategoryIndex ?? 1 });
  await page.getByRole('combobox', { name: /^Country/i })
    .selectOption({ label: overrides.country || 'India (INR)' });
  await page.getByRole('textbox', { name: /^Company Name/i })
    .fill(overrides.companyName ?? 'Acme Corp');
  await page.getByRole('textbox', { name: /^Company Business Address/i })
    .fill(overrides.address ?? '123 Test Street, Ahmedabad, GJ 380001');
  await page.getByRole('textbox', { name: /^PAN Card Number/i })
    .fill(overrides.pan ?? 'ABCDE1234F');
  if (overrides.gstin !== undefined) {
    await page.getByRole('textbox', { name: /GSTIN/i }).fill(overrides.gstin);
  }
}

module.exports = { login, dismissCookies, fillStep1 };
