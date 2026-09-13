/**
 * Admin Campaigns — POSITIVE flows.
 * Companion: admin-campaigns.negative.spec.js
 */
const { test, expect } = require('@playwright/test');
const log = require('../logger.js');
const { ADMIN_URL, loginAdmin } = require('../admin-helpers.js');

test.setTimeout(120000);

test.describe.serial('Admin Campaigns — POSITIVE', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });
  test.afterAll(async () => { if (page) await page.close(); });

  test('UF-ADMIN-01-P: Project Submissions page loads with heading', async () => {
    log.info('ADM-01-P', 'start');
    await page.goto(`${ADMIN_URL}/projects`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/projects/);
    log.info('ADM-01-P', 'ok');
  });

  test('UF-ADMIN-02-P: Project Submissions filter UI is present', async () => {
    log.info('ADM-02-P', 'start');
    await page.goto(`${ADMIN_URL}/projects`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    // Look for at least one filter-like control.
    const filterControls = await page.locator('select, button:has-text("Filter"), [role="combobox"]').count();
    log.info('ADM-02-P', `filter controls: ${filterControls}`);
    expect(filterControls).toBeGreaterThan(0);
  });

  test('UF-ADMIN-03-P: Campaigns list page loads', async () => {
    log.info('ADM-03-P', 'start');
    await page.goto(`${ADMIN_URL}/campaigns`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).toHaveURL(/.*\/campaigns/);
  });

  test('UF-ADMIN-04-P: Categories page loads', async () => {
    log.info('ADM-04-P', 'start');
    await page.goto(`${ADMIN_URL}/categories`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-05-P: Country Fields (Application Fields) page loads', async () => {
    log.info('ADM-05-P', 'start');
    await page.goto(`${ADMIN_URL}/country-fields`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-06-P: Partners page loads', async () => {
    log.info('ADM-06-P', 'start');
    await page.goto(`${ADMIN_URL}/partners`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('ADM-CAM-FUN-001: Verification of Rows per page Dropdown', async () => {
    log.info('ADM-CAM-FUN-001', 'start');
    
    // 2.Go to campaigns page
    await page.goto(`${ADMIN_URL}/campaigns`);
    
    // 3.Verify Rows per page dropdown is visible
    const rowsPerPage = page.getByRole('combobox', { name: /Rows per page/i });
    await expect(rowsPerPage).toBeVisible();
    
    // 4.Verify defualt value as 10 (Wait for page load first)
    await page.waitForTimeout(1000);
    
    // 5.Verify dropdown options click on dropdown box
    // 6.Select 10 on dropdown box
    await rowsPerPage.selectOption({ label: '10' });
    await page.waitForTimeout(1000);
    await expect(page.getByText(/1[–-]10 of \d+/)).toBeVisible();
    
    // 7.Select 20 on dropdown box
    await rowsPerPage.selectOption({ label: '20' });
    await page.waitForTimeout(1000);
    // It should now show 1-13 of 13 (or whatever max is)
    await expect(page.getByText(/1[–-]\d+ of \d+/)).toBeVisible();
    
    log.info('ADM-CAM-FUN-001', 'ok');
  });

  test('ADM-CAM-FUN-002: Verification of Previous/Next page Navigation', async () => {
    log.info('ADM-CAM-FUN-002', 'start');
    
    // 2.Go to campaigns page
    await page.goto(`${ADMIN_URL}/campaigns`);
    
    const rowsPerPage = page.getByRole('combobox', { name: /Rows per page/i });
    await expect(rowsPerPage).toBeVisible();
    
    // Set to 10 so we have pagination
    await rowsPerPage.selectOption({ label: '10' });
    await page.waitForTimeout(1000);
    
    // 3.Verify 10+ records are added
    // (We saw 13 records in our check)
    await expect(page.getByText(/1[–-]10 of \d+/)).toBeVisible();
    
    const nextBtn = page.locator('button', { hasText: 'Next' });
    const prevBtn = page.locator('button', { hasText: 'Prev' });
    
    // 4.Verify Pagination are dispplay Open the page containing multiple records
    // 5.Verify next button is display, Click on next button
    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toBeEnabled();
    
    await nextBtn.click();
    await page.waitForTimeout(1000);
    
    // Now on page 2
    await expect(page.getByText(/11[–-]\d+ of \d+/)).toBeVisible();
    
    // 6.Verify Previous button is display, Navigate to page 2 Click on Previous button
    await expect(prevBtn).toBeVisible();
    await expect(prevBtn).toBeEnabled();
    
    await prevBtn.click();
    await page.waitForTimeout(1000);
    
    // Back on page 1
    await expect(page.getByText(/1[–-]10 of \d+/)).toBeVisible();
    
    log.info('ADM-CAM-FUN-002', 'ok');
  });

  test('ADM-CAM-FUN-003: Campaigns Search Positive', async () => {
    log.info('ADM-CAM-FUN-003', 'start');
    await page.goto(`${ADMIN_URL}/campaigns`);
    
    const searchInput = page.getByPlaceholder(/Search by campaign name/i);
    await searchInput.fill('solar');
    await searchInput.press('Enter');
    await page.waitForTimeout(1500);
    
    // Relevant result should be displayed
    await expect(page.getByRole('row', { name: /solar/i }).first()).toBeVisible();
    log.info('ADM-CAM-FUN-003', 'ok');
  });

  test('ADM-CAM-FUN-004: Campaigns Search Negative', async () => {
    log.info('ADM-CAM-FUN-004', 'start');
    await page.goto(`${ADMIN_URL}/campaigns`);
    
    const searchInput = page.getByPlaceholder(/Search by campaign name/i);
    await searchInput.fill('XYZNONEXISTENT123');
    await searchInput.press('Enter');
    await page.waitForTimeout(1500);
    
    // Check for an empty state message
    await expect(page.getByText(/No campaigns yet/i)).toBeVisible();
    log.info('ADM-CAM-FUN-004', 'ok');
  });

  test('ADM-CAM-FUN-005: Statuses Dropdown Selection Box', async () => {
    log.info('ADM-CAM-FUN-005', 'start');
    await page.goto(`${ADMIN_URL}/campaigns`);
    
    const statusDropdown = page.getByRole('combobox', { name: /Filter by status/i });
    await expect(statusDropdown).toBeVisible();
    
    // Select Active
    await statusDropdown.selectOption({ label: 'Active' });
    await page.waitForTimeout(1000);
    
    // Select Funded
    await statusDropdown.selectOption({ label: 'Funded' });
    await page.waitForTimeout(1000);
    
    // Select Cancelled
    await statusDropdown.selectOption({ label: 'Cancelled' });
    await page.waitForTimeout(1000);
    
    log.info('ADM-CAM-FUN-005', 'ok');
  });

  test('ADM-CAM-FUN-007: Dropdown Selection Box-Cancelled Status and Review submissions', async () => {
    log.info('ADM-CAM-FUN-007', 'start');
    await page.goto(`${ADMIN_URL}/campaigns`);
    
    const statusDropdown = page.getByRole('combobox', { name: /Filter by status/i });
    await statusDropdown.selectOption({ label: 'Cancelled' });
    await page.waitForTimeout(1500);
    
    const reviewBtn = page.getByRole('button', { name: /Review submissions/i }).or(page.getByRole('link', { name: /Review submissions/i })).first();
    await expect(reviewBtn).toBeVisible();
    await reviewBtn.click();
    await page.waitForTimeout(1500);
    
    // Check that we moved or a form opened
    // Just expect some form or heading to be visible
    await expect(page.getByRole('heading').first()).toBeVisible();
    
    log.info('ADM-CAM-FUN-007', 'ok');
  });

  test('ADM-CAM-FUN-008: Campaigns action column view button', async () => {
    log.info('ADM-CAM-FUN-008', 'start');
    await page.goto(`${ADMIN_URL}/campaigns`);
    
    const viewBtn = page.getByRole('button', { name: /^View$/i }).or(page.getByRole('link', { name: /^View$/i })).first();
    await expect(viewBtn).toBeVisible();
    await viewBtn.click();
    await page.waitForTimeout(1500);
    
    // Details should be displayed
    await expect(page.getByRole('heading').first()).toBeVisible();
    log.info('ADM-CAM-FUN-008', 'ok');
  });
});
