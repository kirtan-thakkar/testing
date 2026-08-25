const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://187.77.79.40.nip.io';

test.describe('Campaign Discovery Suite', () => {

  test('TC-005: Search for a campaign on Explore page', async ({ page }) => {
    await page.goto(`${BASE_URL}/explore`);

    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill('solar');
    await searchInput.press('Enter');

    await expect(page.getByText('solar', { exact: false }).first()).toBeVisible();
  });

  test('TC-006: Open global search from header', async ({ page }) => {
    await page.goto(`${BASE_URL}/`);

    // Click "Open search" button in header
    await page.getByRole('button', { name: 'Open search' }).click();

    // Verify search input expands
    const searchInput = page.getByPlaceholder('Search campaigns…');
    await expect(searchInput).toBeVisible();
    
    // Close the modal
    await page.getByRole('button', { name: 'Close search' }).click();
    await expect(searchInput).not.toBeVisible();
  });

});
