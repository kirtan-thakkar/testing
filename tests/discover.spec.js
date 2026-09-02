import { test, expect } from '@playwright/test';

test.describe('4. Discovery & Search Flows', () => {

  test('UF-DISC-01: Global Header Search (Positive Path)', async ({ page }) => {
    await page.goto('/');
    
    // Click Open search button in header
    await page.getByRole('button', { name: 'Open search' }).click();
    
    // Type query and press enter
    const searchInput = page.getByRole('textbox', { name: /search/i });
    await searchInput.fill('solar');
    await searchInput.press('Enter');
    
    // System response: Navigates to explore with query
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/.*\/explore/);
  });

  test('UF-DISC-02: Unsuccessful Campaign Search (Empty State)', async ({ page }) => {
    await page.goto('/explore');
    
    const searchInput = page.getByRole('textbox', { name: 'Search projects or creators...' });
    await searchInput.fill('xyz123nonsense');
    await searchInput.press('Enter');
    await page.waitForLoadState('networkidle');
    
    // Prominent empty state appears — 0 campaigns
    await expect(page.getByText('0 campaigns')).toBeVisible();
  });

  test('UF-DISC-03: Explore Category Filtering', async ({ page }) => {
    await page.goto('/explore');
    
    // Click the "Technology" category button
    await page.getByRole('button', { name: 'Technology', exact: true }).click();
    
    // Assert subtext updates
    await expect(page.getByText('Showing Technology')).toBeVisible();
  });
});
