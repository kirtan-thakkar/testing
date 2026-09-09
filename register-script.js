import {chromium} from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://187.77.79.40.nip.io/register', { waitUntil: 'domcontentloaded' });
  
  // Try finding inputs
  try { await page.locator('input[name="first_name"], input[placeholder*="First"]').fill('Test'); } catch(e){}
  try { await page.locator('input[name="last_name"], input[placeholder*="Last"]').fill('User'); } catch(e){}
  try { await page.locator('input[type="email"], input[name="email"]').fill('dummy3@gmail.com'); } catch(e){}
  try { await page.locator('input[type="password"], input[name="password"]').fill('Puffyin@69'); } catch(e){}
  try { await page.locator('input[name="password_confirmation"], input[placeholder*="Confirm"]').fill('Puffyin@69'); } catch(e){}
  
  try { await page.getByRole('button', { name: /create|register|sign up/i }).click(); } catch(e){}
  
  await page.waitForTimeout(5000);
  console.log('URL after register:', page.url());
  await browser.close();
})();
