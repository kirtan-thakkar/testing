const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('response', response => {
    if (response.url().includes('login')) {
      console.log('<<', response.status(), response.url());
    }
  });

  await page.goto('https://187.77.79.40.nip.io/login');
  await page.locator('input[name="email"]').fill('dummy@gmail.com');
  await page.locator('input[name="password"]').fill('Puffyin@69');
  
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Log In' }).click();
  console.log('Clicked login button');
  
  await page.waitForTimeout(5000);
  console.log('Finished waiting');
  
  await browser.close();
})();
