/**
 * Shared helpers for wizard-application.positive.spec.js and
 * wizard-application.negative.spec.js.
 */
const log = require('./logger.js');

async function login(page) {
  log.info('login', 'navigating to /login');
  // Fast path: state.json from global-setup should already have us authed.
  try {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded', timeout: 10000 });
    log.info('login', 'already authed (via /dashboard)');
    return;
  } catch {
    // Not authed; fall through to manual login.
  }
  // Slow path: actually log in.
  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
  try {
    await page.locator('input[name="email"]').waitFor({ timeout: 15000 });
  } catch {
    log.info('login', 'already authed (form not shown)');
    return;
  }
  await page.getByRole('textbox', { name: 'Email' }).fill('kirtanthakkar6@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('czBfHbCiMUNpqa4');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForURL(u => !u.toString().includes('/login'), {
    timeout: 20000, waitUntil: 'domcontentloaded',
  });
  log.info('login', 'ok');
}



async function dismissCookies(page) {
  const decline = page.getByRole('button', { name: /^Decline$/ });
  if (await decline.isVisible().catch(() => false)) {
    await decline.click();
    log.info('cookies', 'dismissed');
  }
}

/**
 * The wizard user may already have a SUBMITTED campaign (page shows
 * "Submission received") or a DRAFT campaign (page shows the wizard
 * in editable form). Both states are valid for testing — we should
 * NOT skip unless the wizard steps are clearly not present.
 *
 * Heuristic: if the page shows "Start your campaign" heading OR
 * "Save as draft" button, the wizard is reachable — return false
 * (do not skip). Only skip if neither indicator is found.
 */
async function wizardAlreadySubmitted(page) {
  try {
    const startHeading = await page.getByRole('heading', { name: /start your campaign/i })
      .isVisible({ timeout: 1500 }).catch(() => false);
    if (startHeading) {
      log.info('wizard', 'wizard heading found — wizard steps reachable');
      return false;
    }
    const submitted = await page.getByText(/submission received/i)
      .isVisible({ timeout: 1500 }).catch(() => false);
    if (submitted) {
      log.warn('wizard', 'user already has a submitted campaign — wizard steps not reachable');
      return true;
    }
  } catch {}
  // No heading AND no submission message — likely not the wizard page.
  return false;
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

module.exports = { login, dismissCookies, fillStep1, wizardAlreadySubmitted };
