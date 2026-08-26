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
  
  // Step 1
  for (const cb of await page.locator('button[role="checkbox"]').all()) await cb.click();
  const selects = await page.locator('select').all();
  if (selects.length >= 2) {
      await selects[0].selectOption({ index: 1 });
      await page.waitForTimeout(500);
      try { await selects[1].selectOption({ index: 1, timeout: 2000 }); } catch (e) {}
  } else {
      await page.getByText('Select a category').click(); await page.locator('div[role="option"]').nth(1).click();
      await page.waitForTimeout(500);
      try { await page.getByText('Select a subcategory').click({ timeout: 2000 }); await page.locator('div[role="option"]').nth(1).click(); } catch(e){}
  }
  await page.locator('input[name="country"]').fill('India');
  await page.locator('input[name="companyName"]').fill('Test Company');
  await page.locator('input[name="companyAddress"]').fill('123 Test St');
  await page.locator('input[name="panNumber"]').fill('ABCDE1234F');
  
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(2000);
  
  // Step 2
  await page.getByRole('textbox', { name: /Project Title/ }).fill('Amazing Product');
  await page.getByRole('textbox', { name: /Project Story/ }).fill('This is a very long story that exceeds thirty characters for real.');
  await page.locator('input[type="file"]').first().setInputFiles('C:/ideakicks/backend/node_modules/passport/sponsors/fusionauth.png');
  await page.waitForTimeout(1000);
  
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(2000);
  
  console.log('URL after Step 2:', page.url());
  const step3Text = await page.locator('main').innerText().catch(() => '');
  console.log('Step 3 Body:', step3Text.substring(0, 1000));
  
  fs.writeFileSync('step3_html.html', await page.content());
  
  await browser.close();
})();
