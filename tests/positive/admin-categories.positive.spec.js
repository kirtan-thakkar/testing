const { test, expect } = require('@playwright/test');
const { ADMIN_URL, loginAdmin } = require('../admin-helpers.js');
const log = require('../logger.js');

test.describe.serial('Admin Categories - Functional', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });

  test.afterAll(async () => {
    if (page) await page.close();
  });

  test('ADM-CAT-FUN-001: Verify Categories is visible in the Campaigns section', async () => {
    log.info('ADM-CAT-FUN-001', 'start');
    
    // 1. Log in to the Admin panel. (Done via beforeAll)
    // Ensure we are on the dashboard
    await page.goto(`${ADMIN_URL}/dashboard`);

    // 2. Locate the Campaigns section in the sidebar.
    const campaignsBtn = page.getByRole('button', { name: 'Campaigns' });
    await expect(campaignsBtn).toBeVisible();

    // 3. Expand Campaigns if collapsed.
    const isExpanded = await campaignsBtn.getAttribute('aria-expanded');
    if (isExpanded === 'false' || isExpanded === null) {
      await campaignsBtn.click();
      await page.waitForTimeout(500); // Wait for animation
    }

    // 4. Observe the available menu items.
    // Expected: Categories is visible under the Campaigns section.
    const categoriesLink = page.getByRole('link', { name: 'Categories' });
    await expect(categoriesLink).toBeVisible();

    log.info('ADM-CAT-FUN-001', 'Categories link is visible');
  });

  test('ADM-CAT-FUN-001: Search for an existing category', async () => {
    log.info('ADM-CAT-FUN-001 (Search)', 'start');
    
    // 1. Navigate to Categories.
    await page.goto(`${ADMIN_URL}/categories`);
    
    // 2. Locate the Search box.
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await expect(searchInput).toBeVisible();
    
    // 3. Enter the name of an existing category. (Using 'Software')
    await searchInput.fill('Software');
    
    // 4. Click Search or press Enter.
    await searchInput.press('Enter');
    
    // Wait for the network request or table update
    await page.waitForTimeout(1000); // Give it a moment to filter
    
    // 5. Review the search results.
    // Expected: 1. Search input accepts the entered text. (Verified by fill)
    // 2. Matching category is displayed.
    await expect(page.getByRole('row', { name: /Software/i }).first()).toBeVisible();
    
    // 3. Irrelevant categories are excluded from the results.
    await expect(page.getByRole('row', { name: /Hardware/i })).toHaveCount(0);
    
    log.info('ADM-CAT-FUN-001 (Search)', 'ok');
  });

  test('ADM-CAT-FUN-002: Create category with valid details', async () => {
    log.info('ADM-CAT-FUN-002', 'start');
    
    // 1. Navigate to Categories.
    await page.goto(`${ADMIN_URL}/categories`);
    
    // 2. Click New category.
    await page.getByRole('button', { name: /New category/i }).click();
    
    // Wait for the form to appear
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeVisible();
    
    // We will use 'page' to locate the fields, assuming it's not a formContainer.
    const formContainer = page;
    // 3. Enter a valid Name.
    const uniqueName = `Test Category ${Date.now()}`;
    await formContainer.getByLabel(/^Name/i).fill(uniqueName);
    
    // 4. Enter a valid Slug.
    const uniqueSlug = `test-category-${Date.now()}`;
    await formContainer.getByLabel(/^Slug/i).fill(uniqueSlug);
    
    // 5. Select Parent category.
    // The dropdown has 'Top level (no parent)' as default.
    await formContainer.getByLabel(/^Parent category/i).selectOption({ label: 'Top level (no parent)' });
    
    // 6. Enter Sort order.
    await formContainer.getByLabel(/^Sort order/i).fill('1');
    
    // 7. Upload a valid icon.
    const path = require('path');
    const imgPath = path.join(__dirname, '..', '..', 'public', 'aiham-m-azu-GsrfR4I-unsplash.jpg');
    
    // The file input is often visually hidden, so we don't need to click the 'Upload image' button first if we just set the input directly.
    const fileInput = formContainer.locator('input[type="file"]');
    await fileInput.setInputFiles(imgPath);
    
    // Wait for upload button to become active or just click it
    await formContainer.getByRole('button', { name: /Upload/i }).click();
    await page.waitForTimeout(2000); // Wait for upload to complete
    
    // 8. Keep Active enabled.
    const activeCheckbox = formContainer.getByLabel(/Active/i);
    await expect(activeCheckbox).toBeChecked();
    
    // 9. Click Create category.
    await formContainer.getByRole('button', { name: /Create category/i }).click();
    
    // Expected: 3. Category is created successfully.
    // 4. New category appears in the list with the correct details and Active status.
    await expect(newCategoryHeading).toBeHidden({ timeout: 10000 });
    await expect(page).toHaveURL(/.*\/categories/);
    
    // Verify in the list
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    await expect(page.getByRole('row', { name: uniqueName })).toBeVisible();
    
    log.info('ADM-CAT-FUN-002', 'ok');
  });

  test('ADM-CAT-FUN-006: Create an inactive category', async () => {
    log.info('ADM-CAT-FUN-006', 'start');
    
    // 1. Open New category.
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeVisible();
    
    const formContainer = page;
    
    // 2. Enter valid category details.
    const uniqueName = `Test Inactive Cat ${Date.now()}`;
    await formContainer.getByLabel(/^Name/i).fill(uniqueName);
    
    // Slug will auto-fill, we'll leave it.
    
    // 3. Disable the Active checkbox.
    const activeCheckbox = formContainer.getByLabel(/Active/i);
    await activeCheckbox.uncheck();
    await expect(activeCheckbox).not.toBeChecked();
    
    // 4. Click Create category.
    await formContainer.getByRole('button', { name: /Create category/i }).click();
    
    // Wait for slide-over/form to close
    await expect(newCategoryHeading).toBeHidden({ timeout: 10000 });
    
    // 5. Verify the category status.
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    const categoryRow = page.getByRole('row', { name: uniqueName });
    await expect(categoryRow).toBeVisible();
    
    // Expected: 2. Category is shown as inactive/hidden according to the application's behavior.
    // Let's verify the row contains 'Hidden' or similar text/button state.
    // Looking at the DOM for existing rows, an inactive one has a 'Hidden' button/label and a 'Show' button, 
    // whereas an active one has 'Active' and 'Hide'.
    await expect(categoryRow).toContainText(/Hidden/i);
    await expect(categoryRow.getByRole('button', { name: /Show/i })).toBeVisible();
    
    log.info('ADM-CAT-FUN-006', 'ok');
  });

  test('ADM-CAT-FUN-007: Cancel category creation', async () => {
    log.info('ADM-CAT-FUN-007', 'start');
    
    // 1. Click New category.
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeVisible();
    
    const formContainer = page;
    
    // 2. Enter category details.
    const uniqueName = `Test Cancel Cat ${Date.now()}`;
    await formContainer.getByLabel(/^Name/i).fill(uniqueName);
    
    // 3. Click Cancel.
    await formContainer.getByRole('button', { name: /^Cancel$/i }).click();
    
    // Expected: 1. New category form closes.
    await expect(newCategoryHeading).toBeHidden({ timeout: 10000 });
    
    // Expected: 2. Category is not created. 3. Existing category list remains unchanged.
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    await expect(page.getByRole('row', { name: uniqueName })).toHaveCount(0);
    
    log.info('ADM-CAT-FUN-007', 'ok');
  });
});

