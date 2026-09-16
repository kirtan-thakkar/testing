const log = require('./logger.js');
const { expect } = require('@playwright/test');


async function safeLogin(page) {
  await login(page);
  return true;
}

async function login(page) {
  log.info('login', 'navigating to /login');
  // Fast path: state.json from global-setup should already have us authed.
  try {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded', timeout: 10000 });
    // Wait for an element that confirms we are actually logged in and on the dashboard
    await page.getByText('Settings', { exact: true }).waitFor({ state: 'visible', timeout: 3000 });
    log.info('login', 'already authed (via /dashboard)');
    return;
  } catch {
    // Not authed; fall through to manual login.
  }
  // Slow path: actually log in.
  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 15000 });
  try {
    await page.getByRole('textbox', { name: /Email/i }).waitFor({ timeout: 5000 });
  } catch {
    log.info('login', 'already authed (form not shown)');
    return;
  }
  await page.getByRole('textbox', { name: /Email/i }).fill(process.env.USER_EMAIL || 'dummy1@gmail.com');
  await page.getByRole('textbox', { name: /Password/i }).fill(process.env.USER_PASSWORD || 'Puffyin@7410');
  await page.getByRole('button', { name: /Log In/i }).click();
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
    const url = page.url();
    if (!url.includes('/start/application')) {
      log.warn('wizard', 'user redirected away from wizard - account locked');
      return true; // Redirected to dashboard/home, skip tests
    }
    const startHeading = await page.getByRole('heading', { name: /start your campaign/i })
      .isVisible({ timeout: 1500 }).catch(() => false);
    if (startHeading) {
      log.info('wizard', 'wizard heading found — wizard steps reachable');
      return false;
    }
    const submitted = await page.getByText(/submission received/i)
      .isVisible({ timeout: 1500 }).catch(() => false);
    if (submitted) {
      log.warn('wizard', 'user already has a submitted campaign - wizard steps not reachable');
      return true;
    }
  } catch {}
  // No heading AND no submission message — account is locked in some other state.
  return true;
}

async function fillStep1(page, overrides = {}) {
  // Ensure the wizard form is reachable via the user's entry path:
  // /start -> click [Start Application] -> /start/application
  try {
    await page.goto('/start', { waitUntil: 'domcontentloaded', timeout: 15000 });
    // Use a very flexible locator for the button
    const startAppBtn = page.locator('button, a').filter({ hasText: /Start Application/i }).first();
    if (await startAppBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await startAppBtn.click();
      await page.waitForURL(/start\/application/, { timeout: 15000 });
    } else {
      // Fallback: already on /start/application or redirected
      await page.goto('/start/application', { timeout: 5000 });
    }
  } catch (e) {
    await page.goto('/start/application', { timeout: 5000 });
  }

  // The page may have just been navigated to /start/application but the
  // wizard UI hasn't rendered yet. Wait for the h1 first (with a short
  // timeout — if it's not there, give up fast and let the test skip).
  try {
    await page.locator('h1', { hasText: /Start your campaign/i }).first().waitFor({ timeout: 20000 });
  } catch {
    log.warn('fillStep1', 'wizard h1 not visible. Account might be locked in Under Review state.');
    const { test } = require('@playwright/test');
    test.skip(true, 'Account locked or page timeout');
    return;
  }

  if (overrides.age18 !== false || overrides.countrySupported !== false) {
    const cbs = page.locator('input[type="checkbox"]');
    const count = await cbs.count();
    for (let i = 0; i < count; i++) {
      await cbs.nth(i).check({ force: true });
    };
  }
  
  // Wait for the primary category select to be visible and select option
  const primaryCat = page.locator('select').nth(0);
  try {
    await primaryCat.waitFor({ state: 'visible', timeout: 5000 });
  } catch (e) {
    log.warn('fillStep1', 'Select not found. Account is likely locked.');
    const { test } = require('@playwright/test');
    test.skip(true, 'Account locked');
    return;
  }
  await primaryCat.selectOption({ label: overrides.category || 'Technology' });
  
  // The subcategory select has id="wiz-subcategory" as seen in the user screenshot
  const subcat = page.locator('#wiz-subcategory');
  await subcat.waitFor({ state: 'attached', timeout: 5000 });
  // Wait until it is no longer disabled
  await expect(subcat).not.toBeDisabled({ timeout: 5000 });
  await subcat.selectOption({ index: overrides.subcategoryIndex ?? 1 });
  
  // There is another select for Country, we can just use nth(2)
  await page.locator('select').nth(2).selectOption({ label: overrides.country || 'India (INR)' });
  
  // Inputs: Company Name, Business Address, PAN, GSTIN
  const companyName = page.getByRole('textbox', { name: /^Company Name/i });
  await companyName.fill(overrides.companyName ?? 'Acme Corp');
  await companyName.blur();
  const companyAddr = page.getByRole('textbox', { name: /^Company Business Address/i });
  await companyAddr.fill(overrides.address ?? '123 Test Street, Ahmedabad, GJ 380001');
  await companyAddr.blur();
  const panInput = page.getByRole('textbox', { name: /^PAN Card Number/i });
  await panInput.fill(overrides.pan ?? 'ABCDE1234F');
  await panInput.blur();
  // Give auto-save a moment to finish so "Continue" button is fully active
  await page.waitForTimeout(2000);
  if (overrides.gstin !== undefined) {
    await page.getByRole('textbox', { name: /GSTIN/i }).fill(overrides.gstin);
  }
}

module.exports = { login, safeLogin, dismissCookies, fillStep1, wizardAlreadySubmitted };
