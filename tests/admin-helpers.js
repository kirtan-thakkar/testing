/**
 * Shared helpers for admin-*.positive.spec.js and admin-*.negative.spec.js.
 * Logs in to the admin subdomain and returns a page ready for tests.
 *
 * IMPORTANT: the deployed admin rotates refresh tokens per session, so
 * logging in once per spec file (in beforeAll) is the only reliable way.
 */
const log = require('./logger.js');
const fs = require('fs');
const path = require('path');

const ADMIN_URL = 'https://admin.187.77.79.40.nip.io';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@ideakicks.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || `r9Ff{A0Z'kY:{V1W`;

const LOCK_DIR = path.join(process.cwd(), 'logs', 'admin-login.lock');

async function acquireLock() {
  while (true) {
    try {
      fs.mkdirSync(LOCK_DIR);
      return; // Acquired
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

function releaseLock() {
  try { fs.rmdirSync(LOCK_DIR); } catch {}
}

async function loginAdmin(browser) {
  log.info('admin', 'waiting for login lock...');
  await acquireLock();
  try {
    log.info('admin', 'launching browser & logging in');
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${ADMIN_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 90000 });
    try {
      await page.getByRole('textbox', { name: 'Email' }).waitFor({ timeout: 15000 });
    } catch {
      log.info('admin', 'login form not present, may already be authed');
      return { context, page };
    }
    await page.getByRole('textbox', { name: 'Email' }).fill(ADMIN_EMAIL);
    await page.getByRole('textbox', { name: 'Password' }).fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click({ force: true });
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 45000, waitUntil: 'domcontentloaded' }).catch(e => log.warn('admin', 'waitForURL timeout or not navigating'));
    await page.waitForTimeout(2000);
    log.info('admin', `logged in, landed on ${page.url()}`);
    return { context, page };
  } finally {
    releaseLock();
  }
}

module.exports = { ADMIN_URL, ADMIN_EMAIL, ADMIN_PASSWORD, loginAdmin };
