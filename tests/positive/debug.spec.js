const { test, expect } = require('@playwright/test');
const { login, dismissCookies, fillStep1 } = require('../wizard-helpers.js');

test('Debug step 1 continue', async ({ page }) => {
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await login(page);
  await page.goto('/start/application');
  await dismissCookies(page);
  await fillStep1(page);
  
  console.log('Filled step 1. Clicking Continue...');
  const contBtn = page.getByRole('button', { name: /^Continue/i }).first();
  await contBtn.click();
  
  console.log('Clicked Continue. Waiting 3 seconds...');
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: 'step1-after-continue.png', fullPage: true });
  console.log('Saved screenshot step1-after-continue.png');
  
  const step2 = await page.getByText(/Step 2 of 4/i).isVisible();
  console.log('Is Step 2 visible?', step2);
});
