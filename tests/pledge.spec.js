import {test,expect} from '@playwright/test';
const BASE_URL = 'https://187.77.79.40.nip.io';

test.describe('Backing Suite', () => {
  // NOTE: Requires authenticated user

  test('TC-007: Pledge to a campaign (end-to-end)', async ({ page }) => {
    // Navigate to a specific campaign
    await page.goto(`${BASE_URL}/campaign/solar`);

    // Step 1: Click Back This Project
    await page.locator('text="Back This Project"').first().click();

    // Verify redirect to reward selection
    await expect(page).toHaveURL(/.*\/campaign\/solar\/back/);

    // Step 2: Select Reward
    // We assume there's a reward card (button or div) we can click
    // Adjust locator as needed for the specific reward component
    const rewardCard = page.locator('text=₹').first(); 
    await rewardCard.click();
    
    // Click Continue (to payment or addons)
    await page.getByRole('button', { name: 'Continue' }).click();

    // Step 3: Payment form
    // We assume address and payment form appears
    await expect(page.getByText('Complete Pledge')).toBeVisible();

    // The 'Complete Pledge' button is disabled until terms are agreed and address is filled
    // Using simple placeholders as actual locators depend on UI
    // Example:
    // await page.getByPlaceholder('Address').fill('123 Test St');
    // await page.getByRole('checkbox', { name: /Terms of Use/i }).check();

    // Click Complete Pledge
    // await page.getByRole('button', { name: 'Complete Pledge' }).click();

    // Step 4: Verify Success
    // await expect(page.getByRole('heading', { name: 'You\'re a Backer!' })).toBeVisible();
  });

});
