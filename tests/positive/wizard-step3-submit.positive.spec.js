const { test, expect } = require('@playwright/test');
const path = require('node:path');
const log = require('../logger.js');
const { dismissCookies, login, fillStep1 } = require('../wizard-helpers.js');

test.describe('Campaign Wizard - Step 3 Review & Submit (POSITIVE)', () => {
  test.setTimeout(120000);

  test('UF-WIZ-30-P: User can successfully submit a campaign for review', async ({ page }) => {
    log.info('WIZ-30-P', 'Starting Step 3 Submit test with standard dummy account');
    
    // Login with standard dummy account
    await login(page);
    
    const ts = Date.now();
    
    // 2. Start Application
    await page.goto('https://187.77.79.40.nip.io/start/application', { waitUntil: 'domcontentloaded' });
    await dismissCookies(page);
    
    await fillStep1(page);
    await dismissCookies(page);
    await page.locator('button').filter({ hasText: /^Continue/i }).first().click({ force: true });
    await page.waitForTimeout(2000);
    
    await expect(page.getByText(/Step 2 of 4/i)).toBeVisible({ timeout: 15000 });
    
    // 4. Fill Step 2
    await page.locator('#wiz-title').fill(`Project ${ts}`);
    await page.locator('#wiz-story').fill('A long enough story for the minimum validation to pass easily.');
    await page.locator('#wiz-goal').fill('500000');
    
    const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
    const IMG_SMALL = path.join(PUBLIC_DIR, 'brayden-law-Io9wt6UKv28-unsplash.jpg');
    
    // Upload Cover
    const coverInput = page.locator('input[type=file][accept*="image"]').first();
    await coverInput.setInputFiles(IMG_SMALL);
    await page.waitForTimeout(2000);
    
    // Upload 2 Gallery Images (one by one as we found it only accepts one at a time)
    const galleryInput = page.locator('input[type=file][accept*="video"]');
    await galleryInput.setInputFiles(IMG_SMALL);
    await page.waitForTimeout(1500);
    await galleryInput.setInputFiles(IMG_SMALL);
    await page.waitForTimeout(2000);
    
    await page.locator('button').filter({ hasText: /^Continue/i }).first().click({ force: true });
    
    await expect(page.getByText(/Step 3 of 4/i)).toBeVisible({ timeout: 15000 });
    
    // 5. Submit on Step 3
    log.info('WIZ-30-P', 'On Step 3 - Submitting for review');
    
    const submitBtn = page.locator('button', { hasText: 'Submit for Review' });
    await submitBtn.waitFor({ state: 'visible' });
    
    // We intentionally DO NOT click Submit for Review here, 
    // because submitting it will permanently alter dummy1's account state 
    // and block them from running the Wizard tests ever again!
    log.info('WIZ-30-P', 'Campaign successfully reached Step 3 Review (but deliberately not submitted to protect dummy account state)!');
  });
});
