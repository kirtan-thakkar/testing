const { test, expect } = require('@playwright/test');
const { login } = require('../wizard-helpers.js');

test.describe('User Dashboard - Settings (POSITIVE)', () => {

  test.beforeEach(async ({ page }) => {
    // Standard user login via state.json
    await login(page);
    await page.goto('/dashboard');
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.waitForTimeout(1000);
  });

  test('UF-ACCT-01-P: Update Profile Bio, Links and Address', async ({ page }) => {
    // Bio
    const bioText = `Passionate creator ${Date.now()}`;
    await page.locator('textarea').first().fill(bioText);
    
    // Delivery Address
    await page.evaluate(() => {
       const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
       // Fill any input that looks like an address line
       inputs.forEach(input => {
         const ph = (input.placeholder || '').toLowerCase();
         const nm = (input.name || '').toLowerCase();
         if (ph.includes('address') || nm.includes('address')) {
           input.value = '123 Maker Street';
           input.dispatchEvent(new Event('input', { bubbles: true }));
         }
       });
    });

    // Save Changes
    await page.locator('button', { hasText: /Save Changes/i }).first().click();
    
    // Wait for the save to complete (toast or button state change)
    await page.waitForTimeout(2000);
    
    // Verify bio persists by reloading the page
    await page.reload();
    await page.getByRole('button', { name: 'Settings' }).click();
    await page.waitForTimeout(1000);
    await expect(page.locator('textarea').first()).toHaveValue(bioText);
  });

  test('UF-ACCT-02-P: Change Account Password', async ({ page }) => {
    test.setTimeout(60000);
    const currentPass = 'Puffyin@7410';
    const tempPass = 'Puffyin@7410_TEMP';

    let pwdInputs = page.locator('input[type="password"]');
    await pwdInputs.nth(0).fill(currentPass);
    await pwdInputs.nth(1).fill(tempPass);
    if (await pwdInputs.nth(2).isVisible()) {
        await pwdInputs.nth(2).fill(tempPass);
    }
    
    let updateBtn = page.locator('button').filter({ hasText: /(Update|Change) password/i });
    if (await updateBtn.isVisible()) {
        await updateBtn.click();
        
        // Wait for logout redirect
        await page.waitForURL('**/login', { timeout: 15000 });
        
        // Log back in with NEW password
        await page.getByRole('textbox', { name: 'Email' }).fill('dummy@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).fill(tempPass);
        await page.getByRole('button', { name: 'Log In' }).click();
        
        // Wait for login to complete (URL changes away from login)
        await page.waitForURL(u => !u.toString().includes('/login'), { timeout: 15000 });
        
        // Navigate directly to Settings
        await page.goto('/dashboard?tab=settings');
        await page.getByRole('button', { name: 'Settings' }).waitFor({ state: 'visible', timeout: 5000 });
        await page.getByRole('button', { name: 'Settings' }).click();
        await page.waitForTimeout(1000);
        
        // REVERT the password immediately so we don't break the environment
        pwdInputs = page.locator('input[type="password"]');
        await pwdInputs.nth(0).fill(tempPass);
        await pwdInputs.nth(1).fill(currentPass);
        if (await pwdInputs.nth(2).isVisible()) {
            await pwdInputs.nth(2).fill(currentPass);
        }
        
        updateBtn = page.locator('button').filter({ hasText: /(Update|Change) password/i });
        await updateBtn.click();
        
        // Wait for logout redirect again to ensure it finished
        await page.waitForURL('**/login', { timeout: 15000 });
    }
  });

  test('UF-ACCT-03-P: User can sign out', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign Out' }).click();
    // Verify redirection to home or login
    await page.waitForURL(u => u.pathname === '/' || u.pathname.includes('/login'), { timeout: 10000 });
    expect(page.url()).toMatch(/\/(login)?$/);
  });
});
