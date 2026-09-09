const { chromium } = require('@playwright/test');
const fs = require('fs');

module.exports = async config => {
  const browser = await chromium.launch();

  // 1. Authenticate standard backer user.
  try {
    console.log('Authenticating standard user via global setup...');
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://187.77.79.40.nip.io/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.locator('input[name="email"]').fill('dummy@gmail.com');
    await page.locator('input[name="password"]').fill('Puffyin@69');
    await page.getByRole('button', { name: 'Log In' }).click();

    await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 20000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });

    await page.goto('https://187.77.79.40.nip.io/dashboard', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 });

    if (page.url().includes('/login')) {
      throw new Error(`Standard user auth failed: still on ${page.url()}`);
    }

    await page.locator('h1').first().waitFor({ timeout: 10000 });

    await context.storageState({ path: 'state.json' });
    await context.close();
    console.log('Standard user authentication successful!');
  } catch (error) {
    console.error('[WARN] Standard user pre-auth failed:', error.message.split('\n')[0]);
    console.error('[WARN] Tests will attempt their own login; some may skip on slow server.');
    // Don't throw — let tests try. Server flakiness shouldn't kill the entire run.
  }

  // 2. Authenticate admin user
  try {
    console.log('Authenticating admin user via global setup...');
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto('https://admin.187.77.79.40.nip.io/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await adminPage.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
    await adminPage.getByRole('textbox', { name: 'Password' }).fill(`r9Ff{A0Z'kY:{V1W`);
    await adminPage.getByRole('button', { name: 'Sign in' }).click({ force: true });
    await adminPage.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await adminPage.goto('https://admin.187.77.79.40.nip.io/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await adminPage.waitForLoadState('domcontentloaded', { timeout: 30000 });
    await adminContext.storageState({ path: 'admin-state.json' });
    await adminPage.close();
    await adminContext.close();
    console.log('Admin user authentication successful!');
  } catch (error) {
    console.error('[WARN] Admin user pre-auth failed:', error.message.split('\n')[0]);
    // Don't throw.
  }

  await browser.close();
};
