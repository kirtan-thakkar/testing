const { chromium } = require('@playwright/test');
const fs = require('fs');

module.exports = async config => {
  const browser = await chromium.launch();
  
  // 1. Authenticate standard backer user
  try {
    console.log('Authenticating standard user via global setup...');
    const page = await browser.newPage();
    await page.goto('https://187.77.79.40.nip.io/login');
    await page.locator('input[name="email"]').fill('kirtanthakkar6@gmail.com');
    await page.locator('input[name="password"]').fill('czBfHbCiMUNpqa4');  
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.context().storageState({ path: 'state.json' });
    await page.close();
    console.log('Standard user authentication successful!');
  } catch (error) {
    console.error('Standard user authentication failed:', error);
  }

  // 2. Authenticate admin user
  try {
    console.log('Authenticating admin user via global setup...');
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto('https://admin.187.77.79.40.nip.io/login');
    await adminPage.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
    await adminPage.getByRole('textbox', { name: 'Password' }).fill(`r9Ff{A0Z'kY:{V1W`);
    await adminPage.getByRole('button', { name: 'Sign in' }).click();
    await adminPage.waitForLoadState('networkidle', { timeout: 15000 });
    await adminPage.waitForTimeout(2000);
    await adminContext.storageState({ path: 'admin-state.json' });
    await adminPage.close();
    await adminContext.close();
    console.log('Admin user authentication successful!');
  } catch (error) {
    console.error('Admin user authentication failed:', error);
  }

  await browser.close();
};