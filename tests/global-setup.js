const { chromium } = require('@playwright/test');
const fs = require('fs');

module.exports = async config => {
  const browser = await chromium.launch();

  // 1. Authenticate standard backer user.
  // The deployed frontend stores session info client-side (cookies + storage).
  // To make /dashboard auth work in subsequent tests, we must capture state
  // AFTER the user is fully authenticated on a protected page, not just after
  // the login form submit (which only lands on the public landing).
  try {
    console.log('Authenticating standard user via global setup...');
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://187.77.79.40.nip.io/login');
    await page.locator('input[name="email"]').fill('kirtanthakkar6@gmail.com');
    await page.locator('input[name="password"]').fill('czBfHbCiMUNpqa4');
    await page.getByRole('button', { name: 'Log In' }).click();

    // Wait for redirect away from /login
    await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 20000 });
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // Now visit /dashboard to force the client to fully hydrate session
    // (localStorage + cookies) so that subsequent tests with state.json see
    // a working session even when navigating directly to /dashboard.
    await page.goto('https://187.77.79.40.nip.io/dashboard');
    await page.waitForLoadState('networkidle', { timeout: 15000 });

    // If we ended up back on /login, the auth chain failed — bail loudly.
    if (page.url().includes('/login')) {
      throw new Error(`Standard user auth failed: still on ${page.url()}`);
    }

    // Confirm we can see dashboard content
    await page.locator('h1').first().waitFor({ timeout: 10000 });

    await context.storageState({ path: 'state.json' });
    await context.close();
    console.log('Standard user authentication successful!');
  } catch (error) {
    console.error('Standard user authentication failed:', error.message);
    throw error; // fail the suite loudly instead of silently leaving a bad state.json
  }

  // 2. Authenticate admin user
  try {
    console.log('Authenticating admin user via global setup...');
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto('https://admin.187.77.79.40.nip.io/login');
    await adminPage.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
    await adminPage.getByRole('textbox', { name: 'Password' }).fill(`r9Ff{A0Z'kY:{V1W`);
    await adminPage.getByRole('button', { name: 'Sign in' }).click({ force: true });
    await adminPage.waitForLoadState('networkidle', { timeout: 15000 });
    // Visit dashboard so state captures the authed session properly
    await adminPage.goto('https://admin.187.77.79.40.nip.io/');
    await adminPage.waitForLoadState('networkidle', { timeout: 15000 });
    await adminContext.storageState({ path: 'admin-state.json' });
    await adminPage.close();
    await adminContext.close();
    console.log('Admin user authentication successful!');
  } catch (error) {
    console.error('Admin user authentication failed:', error.message);
    throw error;
  }

  await browser.close();
};