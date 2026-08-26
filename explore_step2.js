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
  
  // Go to Step 1
  await page.goto('https://187.77.79.40.nip.io/start/application');
  await page.waitForTimeout(2000);
  
  // Fill Step 1
  // We need to check checkboxes
  const checkboxes = await page.locator('button[role="checkbox"]').all();
  for (const cb of checkboxes) {
    await cb.click();
  }
  
  // Select Category
  await page.locator('button[role="combobox"]').first().click();
  await page.locator('div[role="option"]').first().click();
  
  // Select Subcategory
  await page.locator('button[role="combobox"]').nth(1).click();
  await page.locator('div[role="option"]').first().click();
  
  // Fill Inputs
  // Country
  await page.locator('input[name="country"]').fill('India');
  // Company Name
  await page.locator('input[name="companyName"]').fill('Test Company');
  // Company Address
  await page.locator('input[name="companyAddress"]').fill('123 Test St');
  // PAN
  await page.locator('input[name="panNumber"]').fill('ABCDE1234F');
  
  // Click Continue
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(2000);
  
  console.log('Current URL after Step 1:', page.url());
  
  // Grab Step 2 Body
  const bodyText = await page.locator('body').innerText();
  console.log('Step 2 Content:', bodyText.substring(0, 1500));
  
  // Try to click continue without filling
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(1000);
  
  console.log('Step 2 Validation Errors:', await page.locator('body').innerText());
  
  await browser.close();
})();
