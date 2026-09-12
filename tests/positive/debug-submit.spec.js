const { test, expect } = require('@playwright/test');
const { login, dismissCookies } = require('../wizard-helpers.js');
const fs = require('fs');

test('Debug Step 3', async ({ page }) => {
  await login(page);
  await page.goto('/start/application');
  await dismissCookies(page);
  
  await page.waitForTimeout(3000);
  console.log('Current URL:', page.url());
  
  const html = await page.content();
  console.log('Is Step 1?', html.includes('STEP 1'));
  console.log('Is Step 2?', html.includes('STEP 2'));
  console.log('Is Step 3?', html.includes('STEP 3'));
  
  const submitBtn = page.locator('button', { hasText: 'Submit for Review' });
  if (await submitBtn.isVisible()) {
      console.log('Submit button is visible! Clicking it...');
      
      // Hook into console and network to see if it fails
      page.on('console', msg => console.log('PAGE LOG:', msg.text()));
      page.on('response', response => {
          if (response.url().includes('/api/')) {
              console.log('API Response:', response.url(), response.status());
          }
      });
      
      await submitBtn.click();
      await page.waitForTimeout(5000);
      console.log('URL after click:', page.url());
      
      const afterHtml = await page.content();
      console.log('Has Step 4?', afterHtml.includes('STEP 4'));
      console.log('Has DONE?', afterHtml.includes('DONE'));
      
      // Save screenshot
      await page.screenshot({ path: 'debug-step3.png', fullPage: true });
  } else {
      console.log('Submit button NOT visible on this page.');
      await page.screenshot({ path: 'debug-not-step3.png', fullPage: true });
  }
});
