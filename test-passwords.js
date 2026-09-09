const { chromium } = require('playwright');
import {chromium} from 'playwright';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const passwords = ['Puffyin@7410', 'puffyin@69', 'Puffyin@69 ', 'PuffyIn@69', 'puffyIn@69'];
  
  for (const pwd of passwords) {
    await page.goto('https://187.77.79.40.nip.io/login');
    await page.locator('input[name="email"]').fill('dummy@gmail.com');
    await page.locator('input[name="password"]').fill(pwd);
    
    let is401 = false;
    const responseHandler = (res) => {
      if (res.url().includes('/auth/login')) {
        if (res.status() === 401) is401 = true;
      }
    };
    page.on('response', responseHandler);
    
    await page.getByRole('button', { name: 'Log In' }).click();
    await page.waitForTimeout(2000);
    page.off('response', responseHandler);
    
    if (!is401) {
      console.log('SUCCESS with:', pwd);
      break;
    } else {
      console.log('FAILED with:', pwd);
    }
  }
  
  await browser.close();
})();
