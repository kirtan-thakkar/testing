import { test, expect } from '@playwright/test';

test.describe('4. Discovery & Search Flows', () => {

  test('UF-DISC-01: Global Header Search (Positive Path)', async ({ page }) => {
    await page.goto('https://187.77.79.40.nip.io/');
    
    // Click Open search button in header
    const searchBtn = page.getByRole('button', { name: /open search/i });
    await searchBtn.click();
    
    // Type query and press enter
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('solar');
    await searchInput.press('Enter');
    
    // System response: Navigates to explore with query
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/explore\?q=solar/i);
    
    // Check results metric text
    await expect(page.getByText(/campaigns?/i)).toBeVisible();
  });

  test('UF-DISC-02: Unsuccessful Campaign Search (Empty State)', async ({ page }) => {
    await page.goto('https://187.77.79.40.nip.io/explore');
    
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('xyz123nonsense');
    
    // Wait for client-side filtering or press enter depending on implementation
    await searchInput.press('Enter');
    
    // Prominent empty state appears
    await expect(page.getByText(/no campaigns found/i)).toBeVisible();
  });

  test('UF-DISC-03: Explore Category Filtering', async ({ page }) => {
    await page.goto('https://187.77.79.40.nip.io/explore');
    
    // Click the "Technology" category button
    const techBtn = page.getByRole('button', { name: 'Technology', exact: true });
    await techBtn.click();
    
    // Assert active state or subtext updates
    await expect(page.getByText(/Showing Technology/i)).toBeVisible();
    
    // Assert campaign grid updates (metric)
    const metricText = page.getByText(/campaigns?/i);
    await expect(metricText).toBeVisible();
  });
});
