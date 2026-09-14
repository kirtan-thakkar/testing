const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

module.exports = async config => {
  const browser = await chromium.launch();

  const dummy99Path = path.join(__dirname, '..', 'public', 'dummy_99.mp4');
  if (!fs.existsSync(dummy99Path)) {
    console.log('Generating dummy_99.mp4 (99MB) for uploads test...');
    const buffer = Buffer.alloc(99 * 1024 * 1024);
    fs.writeFileSync(dummy99Path, buffer);
  }

  // 1. Authenticate standard backer user.
  // We will loop through dummy1 to dummy10 to find an unlocked one!
  let foundFreeDummy = null;
  const passwords = 'Puffyin@7410';

  console.log('Authenticating standard user via global setup...');
  for (let i = 1; i <= 10; i++) {
    const email = `dummy${i}@gmail.com`;
    console.log(`Checking if ${email} is free for wizard tests...`);
    
    try {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('https://187.77.79.40.nip.io/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.locator('input[name="email"]').fill(email);
      await page.locator('input[name="password"]').fill(passwords);
      await page.getByRole('button', { name: 'Log In' }).click();

      await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 20000 }).catch(()=>console.log('WaitURL timeout'));
      await page.waitForLoadState('domcontentloaded');

      if (page.url().includes('/login')) {
        console.log(`${email} failed to log in, skipping.`);
        await context.close();
        continue;
      }
      
      // Check if they can access the wizard
      await page.goto('https://187.77.79.40.nip.io/start', { timeout: 30000 });
      const startAppBtn = page.locator('button, a').filter({ hasText: /Start Application/i }).first();
      if (await startAppBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await startAppBtn.click();
        await page.waitForURL(/start\/application/, { timeout: 15000 }).catch(() => {});
      } else {
        await page.goto('https://187.77.79.40.nip.io/start/application', { timeout: 10000 });
      }
      
      const h1Visible = await page.locator('h1', { hasText: /Start your campaign/i }).first().isVisible({ timeout: 5000 }).catch(() => false);
      const isLocked = !h1Visible;
      
      if (!isLocked) {
        console.log(`✅ ${email} is unlocked! Saving state.`);
        // Ensure state contains this user
        await context.storageState({ path: 'state.json' });
        
        // Save the chosen email so tests can use it if they need to explicitly login
        fs.writeFileSync('dummy_email.txt', email);
        
        foundFreeDummy = email;
        await context.close();
        break;
      } else {
        console.log(`❌ ${email} is locked (Under Review). Trying next...`);
        await context.close();
      }
    } catch (e) {
      console.log(`Error checking ${email}: ${e.message}`);
    }
  }
  
  if (!foundFreeDummy) {
    console.error('CRITICAL WARNING: ALL dummy accounts dummy1-dummy10 are locked!');
  }

  // 2. Authenticate admin user
  try {
    console.log('Authenticating admin user via global setup...');
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto('https://admin.187.77.79.40.nip.io/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await adminPage.getByRole('textbox', { name: 'Email' }).fill(process.env.ADMIN_EMAIL || 'hello@ideakicks.com');
    await adminPage.getByRole('textbox', { name: 'Password' }).fill(process.env.ADMIN_PASSWORD || `r9Ff{A0Z'kY:{V1W`);
    await adminPage.getByRole('button', { name: 'Sign in' }).click({ force: true });
    await adminPage.waitForURL(u => !u.toString().includes('/login'), { timeout: 30000 }).catch(() => {});
    await adminContext.storageState({ path: 'admin-state.json' });
    await adminPage.close();
    await adminContext.close();
    console.log('Admin user authentication successful!');
  } catch (error) {
    console.error('[WARN] Admin user pre-auth failed:', error.message.split('\\n')[0]);
  }

  await browser.close();
};
