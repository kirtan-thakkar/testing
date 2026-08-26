const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://187.77.79.40.nip.io/login');
  await page.locator('input[name="email"]').fill('kirtanthakkar6@gmail.com');
  await page.locator('input[name="password"]').fill('czBfHbCiMUNpqa4');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.waitForTimeout(2000);
  
  await page.goto('https://187.77.79.40.nip.io/start/application');
  await page.waitForTimeout(2000);
  
  // Step 1 Checkboxes
  const checkboxes = await page.locator('button[role="checkbox"]').all();
  for (const cb of checkboxes) {
    await cb.click();
  }
  
  // Comboboxes for category
  const comboboxes = await page.locator('button[role="combobox"]').all();
  if (comboboxes.length >= 2) {
      await comboboxes[0].click();
      await page.waitForTimeout(500);
      await page.locator('div[role="option"]').first().click();
      
      await comboboxes[1].click();
      await page.waitForTimeout(500);
      await page.locator('div[role="option"]').first().click();
  } else {
      console.log('Comboboxes not found. Trying selects...');
      const selects = await page.locator('select').all();
      if (selects.length >= 2) {
          await selects[0].selectOption({ index: 1 });
          await selects[1].selectOption({ index: 1 });
      } else {
          console.log('Selects not found either. Just clicking anything that says Select.');
          await page.getByText('Select a category').click();
          await page.waitForTimeout(500);
          await page.locator('div[role="option"]').first().click();
          
          await page.getByText('Select a subcategory').click();
          await page.waitForTimeout(500);
          await page.locator('div[role="option"]').first().click();
      }
  }
  
  // Inputs
  await page.locator('input[name="country"]').fill('India');
  await page.locator('input[name="companyName"]').fill('Test Company');
  await page.locator('input[name="companyAddress"]').fill('123 Test St');
  await page.locator('input[name="panNumber"]').fill('ABCDE1234F');
  
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(3000);
  
  console.log('URL after Step 1:', page.url());
  
  // Step 2 Content
  const step2Text = await page.locator('main').innerText().catch(() => 'Main not found');
  console.log('Step 2 Body:', step2Text.substring(0, 1500));
  
  // Save Step 2 HTML for reference
  const html2 = await page.content();
  fs.writeFileSync('step2_html.html', html2);
  
  await browser.close();
})();
