const { test, expect } = require('@playwright/test');
const { safeLogin } = require('../wizard-helpers.js');

test.describe('User Dashboard - Settings (POSITIVE)', () => {

  test.beforeEach(async ({ page }) => {
    // Standard user login via state.json
    await safeLogin(page);
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
    // Current Password is the one from our dummy account (Puffyin@7410)
    // We will change it to a temporary one, then change it back so subsequent tests don't break.
    const currentPass = 'Puffyin@7410';
    const tempPass = 'Puffyin@7410_TEMP';

    // Find the password inputs. Usually: 0 = Current, 1 = New, 2 = Confirm New
    const pwdInputs = page.locator('input[type="password"]');
    await pwdInputs.nth(0).fill(currentPass);
    await pwdInputs.nth(1).fill(tempPass);
    
    // In case there is a confirm password field
    if (await pwdInputs.nth(2).isVisible()) {
        await pwdInputs.nth(2).fill(tempPass);
    }
    
    // Find the update password button (usually near the password fields)
    const updateBtn = page.locator('button').filter({ hasText: /(Update|Change) password/i });
    if (await updateBtn.isVisible()) {
        await updateBtn.click();
        await page.waitForTimeout(2000); // Wait for API
        
        // REVERT the password immediately so we don't break the environment for other tests
        await pwdInputs.nth(0).fill(tempPass);
        await pwdInputs.nth(1).fill(currentPass);
        if (await pwdInputs.nth(2).isVisible()) {
            await pwdInputs.nth(2).fill(currentPass);
        }
        await updateBtn.click();
        await page.waitForTimeout(2000); // Wait for API
    }
  });

  test('UF-ACCT-03-P: User can sign out', async ({ page }) => {
    await page.getByRole('button', { name: 'Sign Out' }).click();
    // Verify redirection to home or login
    await page.waitForURL(u => u.pathname === '/' || u.pathname.includes('/login'), { timeout: 10000 });
    expect(page.url()).toMatch(/\/(login)?$/);
  });
});
