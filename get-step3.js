const { chromium } = require('playwright');
const path = require('node:path');
const { login, fillStep1, dismissCookies } = require('./tests/wizard-helpers.js');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL: 'https://187.77.79.40.nip.io' });
  const page = await context.newPage();
  
  await login(page);
  
  await page.goto('/start/application');
  await page.waitForTimeout(2000);
  
  const stepText = await page.getByText(/Step \d of \d/i).first().textContent();
  console.log('Currently on:', stepText);
  if (stepText && stepText.includes('Step 1')) {
    await fillStep1(page);
    await dismissCookies(page);
    await page.locator('button').filter({ hasText: /^Continue/i }).first().click({ force: true });
    await page.waitForTimeout(3000);
  }
  
  const step2Text = await page.getByText(/Step \d of \d/i).first().textContent();
  console.log('After step 1 check, currently on:', step2Text);
  if (step2Text && step2Text.includes('Step 2')) {
    // Fill Step 2
    await page.locator('#wiz-title').fill('BrightLabs Cafe');
    await page.locator('#wiz-story').fill('A long enough story for the minimum validation to pass easily.');
    await page.locator('#wiz-goal').fill('500000');
    const coverInput = page.locator('input[type=file][accept*="image"]').first();
    await coverInput.setInputFiles(path.join(__dirname, 'public', 'brayden-law-Io9wt6UKv28-unsplash.jpg'));
    await page.waitForTimeout(3000);
    await page.locator('button').filter({ hasText: /^Continue/i }).first().click({ force: true });
    await page.waitForTimeout(5000);
  }

  const step3Text = await page.getByText(/Step \d of \d/i).first().textContent();
  console.log('Currently on:', step3Text);

  // Take screenshot of step 3
  await page.screenshot({ path: 'step3.png', fullPage: true });
  console.log('Saved step3.png');
  
  const html = await page.content();
  const fs = require('fs');
  fs.writeFileSync('step3.html', html);
  console.log('Saved step3.html');
  
  await browser.close();
})();
