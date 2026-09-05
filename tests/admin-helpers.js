/**
 * Shared helpers for admin-*.positive.spec.js and admin-*.negative.spec.js.
 * Logs in to the admin subdomain and returns a page ready for tests.
 *
 * IMPORTANT: the deployed admin rotates refresh tokens per session, so
 * logging in once per spec file (in beforeAll) is the only reliable way.
 */
const log = require('./logger.js');

const ADMIN_URL = 'https://admin.187.77.79.40.nip.io';
const ADMIN_EMAIL = 'hello@ideakicks.com';
const ADMIN_PASSWORD = `r9Ff{A0Z'kY:{V1W`;

async function loginAdmin(browser) {
  log.info('admin', 'launching browser & logging in');
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${ADMIN_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  try {
    await page.getByRole('textbox', { name: 'Email' }).waitFor({ timeout: 60000 });
  } catch {
    log.info('admin', 'login form not present, may already be authed');
    return { context, page };
  }
  await page.getByRole('textbox', { name: 'Email' }).fill(ADMIN_EMAIL);
  await page.getByRole('textbox', { name: 'Password' }).fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click({ force: true });
  await page.waitForLoadState('domcontentloaded', { timeout: 90000 });
  await page.waitForTimeout(2000);
  log.info('admin', `logged in, landed on ${page.url()}`);
  return { context, page };
}

module.exports = { ADMIN_URL, ADMIN_EMAIL, ADMIN_PASSWORD, loginAdmin };
