const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://187.77.79.40.nip.io';

test.describe('Campaign Application Suite', () => {
  // NOTE: These tests require the user to be authenticated.
  // Playwright should be configured to inject an authenticated storageState for these tests.

  test.beforeEach(async ({ page }) => {
    // Navigate to the start application wizard
    await page.goto(`${BASE_URL}/start/application`);
  });

  test('TC-008: Start a new campaign application (Wizard Flow)', async ({ page }) => {
    // STEP 1: Plan & Set Up
    await expect(page.getByRole('heading', { name: 'Start your campaign' })).toBeVisible();
    await expect(page.getByText('Plan & Set Up')).toBeVisible();

    // Fill form (Assuming checkboxes, dropdowns and textboxes exist)
    // We can click "Continue" assuming draft data is already populated or fill mandatory fields here.
    
    // In our manual test, draft data existed, so we just clicked Continue.
    const continueButton1 = page.getByRole('button', { name: 'Continue' });
    await expect(continueButton1).toBeVisible();
    await continueButton1.click();

    // STEP 2: Build Campaign Page
    await expect(page.getByRole('heading', { name: 'Build Campaign Page' })).toBeVisible();
    
    await page.getByRole('textbox', { name: 'Project Title A short,' }).fill('My Awesome Project');
    await page.getByRole('textbox', { name: 'Project Story Explain what' }).fill('This is a great project that will do great things. It is at least 30 characters long to pass validation.');
    await page.getByRole('spinbutton', { name: 'Funding Goal (INR) How much' }).fill('10000');
    
    const continueButton2 = page.getByRole('button', { name: 'Continue' });
    await continueButton2.click();

    // STEP 3: Review & Submit
    await expect(page.getByRole('heading', { name: 'Review & Submit' })).toBeVisible();
    await expect(page.getByText('My Awesome Project')).toBeVisible();
    await expect(page.getByText('₹10,000')).toBeVisible();

    // Submit for Review
    const submitRequestPromise = page.waitForResponse(res => res.url().includes('/me/project-draft/submit') && res.request().method() === 'POST');
    await page.getByRole('button', { name: 'Submit for Review' }).click();

    const submitResponse = await submitRequestPromise;
    expect(submitResponse.status()).toBe(200);

    // STEP 4: Done
    await expect(page.getByRole('heading', { name: 'Submission received!' })).toBeVisible();
    await expect(page.getByText('Status: UNDER REVIEW')).toBeVisible();
  });

});
