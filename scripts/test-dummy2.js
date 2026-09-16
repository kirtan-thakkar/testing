const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();
  
  await page.goto('https://187.77.79.40.nip.io/login');
  await page.getByRole('textbox', { name: /Email/i }).fill('dummy2@gmail.com');
  await page.getByRole('textbox', { name: /Password/i }).fill('Puffyin@7410');
  await page.getByRole('button', { name: /Sign in/i }).click();
  
  try {
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('dummy2 Login Success!');
    
    // Check if dummy2 can apply
    await page.goto('https://187.77.79.40.nip.io/start/application');
    await page.waitForTimeout(2000);
    const content = await page.content();
    if (content.includes('Company Name') || content.includes('Create your campaign')) {
        console.log('dummy2 can apply!');
    } else {
        console.log('dummy2 CANNOT apply!');
    }
  } catch (e) {
    console.log('dummy2 Login Failed!', e.message);
  }
  await browser.close();
})();
