import { test, expect } from '@playwright/test';

test.describe('2. Campaign Creation (Creator Wizard) Flows', () => {

  test('UF-CREA-01: Campaign Application - Step 1 Validation Errors', async ({ page }) => {
    // Navigate using absolute URL to ensure routing works correctly from global state
    await page.goto('https://187.77.79.40.nip.io/start/application');
    
    // Attempt to proceed without filling fields
    const continueBtn = page.getByRole('button', { name: /^continue$|^next$/i });
    await continueBtn.click();
    
    // Expect validation errors on the page
    const errorMessages = page.getByText(/required|cannot be empty/i);
    await expect(errorMessages.first()).toBeVisible();
    
    // User remains on step 1
    await expect(page).toHaveURL(/.*\/start\/application/);
  });

  test('UF-CREA-02: Campaign Application - Draft Persistence', async ({ page }) => {
    await page.goto('https://187.77.79.40.nip.io/start/application');
    
    // Fill step 1 fields
    const businessNameInput = page.getByRole('textbox', { name: /business name/i });
    await businessNameInput.fill('My Draft Business');
    
    const panInput = page.getByRole('textbox', { name: /pan/i });
    await panInput.fill('ABCDE1234F');
    
    // Wait a moment for debounced auto-save or click continue to force save
    const continueBtn = page.getByRole('button', { name: /^continue$|^next$/i });
    await continueBtn.click();
    
    // Navigate away
    await page.goto('https://187.77.79.40.nip.io/dashboard');
    
    // Return and verify persistence
    await page.goto('https://187.77.79.40.nip.io/start/application');
    await expect(businessNameInput).toHaveValue('My Draft Business');
  });

  test('UF-CREA-03: Campaign Application - Step 2 to Submission', async ({ page }) => {
    await page.goto('https://187.77.79.40.nip.io/start/application');
    
    // Assume step 1 is filled from persistence, click next
    await page.getByRole('button', { name: /^continue$|^next$/i }).click();
    
    // Fill step 2 (Campaign Details)
    await page.getByRole('textbox', { name: /title/i }).fill('Solar Purifier v2');
    await page.getByRole('textbox', { name: /subtitle/i }).fill('Clean energy for everyone');
    await page.getByRole('textbox', { name: /story/i }).fill('This is a highly detailed story about our campaign...');
    await page.getByRole('spinbutton', { name: /goal/i }).fill('15000');
    
    // Finish and submit
    await page.getByRole('button', { name: /^continue$|^next$/i }).click();
    await page.getByRole('button', { name: 'Submit for Review', exact: true }).click();
    
    // Wait for the modal or redirect to the dashboard
    await expect(page.getByText(/submission received/i)).toBeVisible();
    await expect(page.getByText(/under review/i)).toBeVisible();
  });
});
