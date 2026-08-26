const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Login
  await page.goto('https://187.77.79.40.nip.io/login');
  await page.locator('input[name="email"]').fill('kirtanthakkar6@gmail.com');
  await page.locator('input[name="password"]').fill('czBfHbCiMUNpqa4');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(2000);
  
  // Go to Settings / Profile
  // First, let's navigate to /dashboard and see if there are tabs
  await page.goto('https://187.77.79.40.nip.io/dashboard');
  await page.waitForTimeout(2000);
  
  const dashboardInner = await page.locator('body').innerText();
  console.log('Dashboard body:', dashboardInner.substring(0, 1000));
  
  // Click Settings if it exists
  const settingsTab = page.locator('text=Settings');
  if (await settingsTab.count() > 0) {
      await settingsTab.first().click();
      await page.waitForTimeout(1000);
      const settingsInner = await page.locator('body').innerText();
      console.log('Settings body:', settingsInner.substring(0, 1500));
  } else {
      console.log('No Settings tab found. Taking a screenshot of dashboard.');
      await page.screenshot({ path: 'dashboard.png' });
  }
  
  await browser.close();
})();
