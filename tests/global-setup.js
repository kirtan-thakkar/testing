const { chromium } = require('@playwright/test');

module.exports = async config => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log('Authenticating via global setup...');

  // Navigate to login
  await page.goto('https://187.77.79.40.nip.io/login');
  
  // Fill credentials
  await page.locator('input[name="email"]').fill('kirtanthakkar6@gmail.com');
  await page.locator('input[name="password"]').fill('czBfHbCiMUNpqa4');  
  
  await page.getByRole('button', { name: 'Log In' }).click();
  
  // Wait for the login to succeed
  try {
    // The user may be redirected to '/' or '/dashboard', so we just wait for network idle
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    console.log('Authentication successful!');
  } catch (error) {
    console.error('Authentication failed or timeout reached.');
    throw error;
  }

  // Save the state with the fresh authentication token
  await page.context().storageState({ path: 'state.json' });
  await browser.close();
};