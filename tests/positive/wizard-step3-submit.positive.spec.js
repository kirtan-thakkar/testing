const { test, expect } = require('@playwright/test');
const path = require('node:path');
const log = require('../logger.js');
const { dismissCookies } = require('../wizard-helpers.js');

test.describe('Campaign Wizard - Step 3 Review & Submit (POSITIVE)', () => {
  test.setTimeout(90000);

  test('UF-WIZ-30-P: User can successfully submit a campaign for review', async ({ browser }) => {
    // 1. Create a fresh account specifically for this test so we don't lock dummy@gmail.com
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const ts = Date.now();
    const testEmail = `submitter-${ts}@ideakicks.test`;
    const testPass = 'Puffyin@7410';
    
    log.info('WIZ-30-P', `Registering fresh user: ${testEmail}`);
    await page.goto('https://187.77.79.40.nip.io/register');
    await page.getByPlaceholder(/Alex/i).waitFor({ state: 'visible', timeout: 15000 });
    await page.getByPlaceholder(/Alex/i).fill('Test Submitter');
    await page.getByPlaceholder(/you@example.com/i).fill(testEmail);
    await page.locator('input[type="password"]').fill(testPass);
    await page.getByRole('button', { name: /Sign Up|Create Account|Submit/i }).click();
    
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    
    // 2. Start Application
    await page.goto('https://187.77.79.40.nip.io/start/application', { waitUntil: 'domcontentloaded' });
    await dismissCookies(page);
    
    // 3. Fill Step 1
    await page.getByText(/I confirm I am 18/i).click({ force: true });
    await page.getByText(/I confirm I reside in a country/i).click({ force: true });
    await page.getByRole('combobox', { name: /^Primary Category/i }).selectOption({ index: 1 });
    await page.waitForTimeout(1000);
    await page.getByRole('combobox', { name: /^Subcategory/i }).selectOption({ index: 1 });
    await page.getByRole('textbox', { name: /^Company Name/i }).fill('Acme Corp');
    await page.getByRole('textbox', { name: /^Company Business Address/i }).fill('123 Test Street, Ahmedabad, GJ 380001');
    await page.getByRole('textbox', { name: /^PAN Card Number/i }).fill('ABCDE1234F');
    await page.locator('button').filter({ hasText: /^Continue/i }).first().click({ force: true });
    
    await expect(page.getByText(/Step 2 of 4/i)).toBeVisible({ timeout: 15000 });
    
    // 4. Fill Step 2
    await page.locator('#wiz-title').fill(`Project ${ts}`);
    await page.locator('#wiz-story').fill('A long enough story for the minimum validation to pass easily.');
    await page.locator('#wiz-goal').fill('500000');
    
    const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
    const IMG_SMALL = path.join(PUBLIC_DIR, 'brayden-law-Io9wt6UKv28-unsplash.jpg');
    const coverInput = page.locator('input[type=file][accept*="image"]').first();
    await coverInput.setInputFiles(IMG_SMALL);
    await page.waitForTimeout(3000);
    
    await page.locator('button').filter({ hasText: /^Continue/i }).first().click({ force: true });
    
    await expect(page.getByText(/Step 3 of 4/i)).toBeVisible({ timeout: 15000 });
    
    // 5. Submit on Step 3
    log.info('WIZ-30-P', 'On Step 3 - Submitting for review');
    await page.locator('button').filter({ hasText: /Submit for Review/i }).click({ force: true });
    
    // 6. Verify Step 4 / Done Success State
    await expect(page.getByText(/Under Review|Done|Success|submitted/i).first()).toBeVisible({ timeout: 15000 });
    log.info('WIZ-30-P', 'Campaign successfully submitted!');
    
    await context.close();
  });
});
