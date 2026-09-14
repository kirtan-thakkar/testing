const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext();
  const p = await c.newPage();
  
  await p.goto('https://admin.187.77.79.40.nip.io/login');
  await p.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
  await p.getByRole('textbox', { name: 'Password' }).fill('r9Ff{A0Z\'kY:{V1W');
  await p.getByRole('button', { name: 'Sign in' }).click();
  await p.waitForURL('**/dashboard');
  
  await p.goto('https://admin.187.77.79.40.nip.io/projects');
  await p.waitForLoadState('domcontentloaded');
  await p.waitForTimeout(2000);
  
  await p.getByRole('link', { name: 'Review' }).first().click();
  await p.waitForLoadState('domcontentloaded');
  await p.waitForTimeout(2000);
  
  await p.getByRole('button', { name: 'Reject…' }).click();
  await p.waitForTimeout(1000);
  
  const text = await p.locator('[role="dialog"]').innerText();
  console.log('Dialog:', text);
  
  await p.getByRole('textbox').fill('rejected for test automation');
  await p.getByRole('button', { name: 'Confirm Rejection' }).click();
  await p.waitForTimeout(2000);
  console.log('Rejected!');
  
  await b.close();
})();
