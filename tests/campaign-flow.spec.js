const { test, expect } = require('@playwright/test');

test.describe('Campaign Creation and Backend Verification', () => {

  test('Flow 1 & 2: Submit campaign and verify backend /save response', async ({ page }) => {
    // 1. Navigate to the application
    await page.goto('https://187.77.79.40.nip.io/');

    // 2. Set up a listener for the exact backend API call found in the HAR file
    const saveResponsePromise = page.waitForResponse(response => 
      response.url().includes('api.187.77.79.40.nip.io/campaigns/') && 
      response.url().includes('/save') &&
      response.request().method() === 'POST',
      { timeout: 30000 }
    );

    // 3. UI Interactions to trigger the save
    // NOTE: Update these specific locators using `npx playwright codegen` to match your actual frontend UI
    console.log('Navigating and interacting with the form...');
    
    // Example navigation (Adjust to your actual app's buttons)
    // await page.getByRole('link', { name: 'Start a Project' }).click();
    // await page.getByLabel('Campaign Name').fill('smart-garden-system');
    // await page.getByRole('button', { name: 'Save Campaign' }).click();
    
    // Temporarily pausing the test so you can manually click through if you haven't filled in the locators above
    // Remove page.pause() once you add your exact click/fill steps.
    await page.pause();

    // 4. Wait for the backend response after the save button is clicked
    const response = await saveResponsePromise;
    
    // Assert the backend returned 200 OK (extracted from your HAR file)
    expect(response.status()).toBe(200);

    // Assert the JSON response matches exactly what the HAR file recorded
    const responseBody = await response.json();
    expect(responseBody).toEqual({ saved: true });
  });

  test('Flow 3: Reload page and verify campaign details load', async ({ page }) => {
    // Navigate directly to the campaign page to verify it loads from the backend
    await page.goto('https://187.77.79.40.nip.io/campaign/smart-garden-system');
    
    // Verify the UI loads the correct details
    // Update the locator to match where the campaign title renders in your DOM
    await expect(page.locator('body')).toContainText('Smart Garden System');
  });
});
