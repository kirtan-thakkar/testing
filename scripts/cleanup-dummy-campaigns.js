const { chromium } = require('@playwright/test');

async function cleanupDummyCampaigns() {
  console.log('Starting automated cleanup of dummy campaigns...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  try {
    // 1. Admin Login
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.getByRole('textbox', { name: /Email/i }).fill('hello@ideakicks.com');
    await page.getByRole('textbox', { name: /Password/i }).fill("r9Ff{A0Z'kY:{V1W");
    await page.getByRole('button', { name: /Sign in/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 15000 });
    console.log('Admin login successful.');

    // 2. Go to Projects Submissions page
    await page.goto('https://admin.187.77.79.40.nip.io/projects', { waitUntil: 'domcontentloaded' });
    
    // We will loop and reject all dummy1 projects
    let hasMore = true;
    while (hasMore) {
      await page.waitForTimeout(2000); // Wait for table to render

      // Find any row that belongs to dummy1@gmail.com
      const dummyRow = page.locator('tr').filter({ hasText: 'dummy1@gmail.com' }).first();
      
      if (await dummyRow.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Found a dummy campaign submission. Proceeding to review...');
        // Click the 'Review' link in that row
        await dummyRow.getByRole('link', { name: /Review/i }).click();
        
        // Wait to load the project review page
        await page.waitForTimeout(3000);
        
        // Click 'Reject...'
        const rejectBtn = page.locator('button', { hasText: 'Reject' }).first();
        await rejectBtn.waitFor({ state: 'visible' });
        await rejectBtn.click();
        
        // Fill rejection reason
        const reasonInput = page.locator('textarea#reject-reason, textarea[placeholder*="Shown to the creator"]');
        await reasonInput.waitFor({ state: 'visible' });
        await reasonInput.fill('Automated test cleanup: Rejecting test submission');
        
        // Click 'Confirm rejection'
        const confirmBtn = page.getByRole('button', { name: /Confirm rejection/i });
        await confirmBtn.waitFor({ state: 'visible' });
        await confirmBtn.click();
        
        console.log('Dummy campaign rejected successfully.');
        
        // Go back to projects to check for more
        await page.goto('https://admin.187.77.79.40.nip.io/projects', { waitUntil: 'domcontentloaded' });
      } else {
        console.log('No more dummy campaigns found in Under Review.');
        hasMore = false;
      }
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await browser.close();
    console.log('Cleanup script finished.');
  }
}

if (require.main === module) {
  cleanupDummyCampaigns();
}

module.exports = cleanupDummyCampaigns;
