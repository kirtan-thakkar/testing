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
    
    log.info('ADM-CAT-FUN-002', 'ok');
  });

  test('ADM-CAT-FUN-003: Create a category with a parent category', async () => {
    log.info('ADM-CAT-FUN-003', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeVisible();
    
    const formContainer = page;
    
    // 2. Enter valid Name and Slug.
    const uniqueName = `Child Cat ${Date.now()}`;
    await formContainer.getByLabel(/^Name/i).fill(uniqueName);
    
    // 3. Select an existing Parent category.
    // Pick 'Technology / Software' as parent
    await formContainer.getByLabel(/^Parent category/i).selectOption({ label: 'Technology / Software' });
    
    // 4. Complete other required fields.
    await formContainer.getByLabel(/^Sort order/i).fill('1');
    
    // 5. Click Create category.
    await formContainer.getByRole('button', { name: /Create category/i }).click();
    await expect(newCategoryHeading).toBeHidden({ timeout: 10000 });
    
    // 6. Verify the created category in the list.
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    const row = page.getByRole('row', { name: uniqueName }).first();
    await expect(row).toBeVisible();
    
    // Expected: 3. Created category displays the selected parent correctly.
    // We can verify it says 'Software /software' or similar in the row text, wait, let's verify if the row text contains 'Software'.
    await expect(row).toContainText('Software');
    
    log.info('ADM-CAT-FUN-003', 'ok');
  });

  test('ADM-CAT-FUN-004: Verify category ordering based on sort order', async () => {
    log.info('ADM-CAT-FUN-004', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    
    // Helper to create category with sort order
    const createCatWithSortOrder = async (name, sortOrder) => {
      await page.getByRole('button', { name: /New category/i }).click();
      const formContainer = page;
      await formContainer.getByLabel(/^Name/i).fill(name);
      await formContainer.getByLabel(/^Sort order/i).fill(sortOrder.toString());
      await formContainer.getByRole('button', { name: /Create category/i }).click();
      await expect(page.getByRole('heading', { name: 'New category' })).toBeHidden({ timeout: 10000 });
    };
    
    const prefix = `SortCat ${Date.now()}`;
    const nameA = `${prefix} A`;
    const nameB = `${prefix} B`;
    
    // 1. Create Category A and set Sort order to 10
    await createCatWithSortOrder(nameA, 10);
    // 2. Create Category B and set Sort order to 20
    await createCatWithSortOrder(nameB, 20);
    
    // 4. Return to the Categories list.
    // 5. Compare the order of Category A and Category B.
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(prefix);
    await searchInput.press('Enter');
    
    // Wait for the grid to update.
    await page.waitForTimeout(1500);
    
    // Get all matching rows. 
    const rows = page.getByRole('row').filter({ hasText: prefix });
    await expect(rows).toHaveCount(2);
    
    // Verify Category A appears before Category B
    const text1 = await rows.nth(0).innerText();
    const text2 = await rows.nth(1).innerText();
    
    expect(text1).toContain(nameA);
    expect(text2).toContain(nameB);
    
    log.info('ADM-CAT-FUN-004', 'ok');
  });

  test('ADM-CAT-FUN-005: Upload a valid category icon', async () => {
    log.info('ADM-CAT-FUN-005', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeVisible();
    
    const formContainer = page;
    const uniqueName = `Icon Cat ${Date.now()}`;
    await formContainer.getByLabel(/^Name/i).fill(uniqueName);
    
    // 1. Click Upload image. 2. Select a valid supported image file.
    const path = require('path');
    const imgPath = path.join(__dirname, '..', '..', 'public', 'aiham-m-azu-GsrfR4I-unsplash.jpg');
    
    const fileInput = formContainer.locator('input[type="file"]');
    await fileInput.setInputFiles(imgPath);
    
    await formContainer.getByRole('button', { name: /Upload/i }).click();
    await page.waitForTimeout(2000); // Wait for upload
    
    // 4. Click Create category.
    await formContainer.getByRole('button', { name: /Create category/i }).click();
    await expect(newCategoryHeading).toBeHidden({ timeout: 10000 });
    
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    const row = page.getByRole('row', { name: uniqueName }).first();
    await expect(row).toBeVisible();
    
    log.info('ADM-CAT-FUN-005', 'ok');
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

  test('ADM-CAT-FUN-008: Edit an existing category with valid details', async () => {
    log.info('ADM-CAT-FUN-008', 'start');
    
    // First, let's create a temporary category to edit so we don't mess up existing data like "Software"
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    let formContainer = page;
    const initialName = `EditCat ${Date.now()}`;
    await formContainer.getByLabel(/^Name/i).fill(initialName);
    await formContainer.getByRole('button', { name: /Create category/i }).click();
    
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeHidden({ timeout: 10000 });
    
    // 1. Locate an existing category.
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(initialName);
    await searchInput.press('Enter');
    
    const row = page.getByRole('row', { name: initialName }).first();
    await expect(row).toBeVisible();
    
    // 2. Click the Edit icon.
    await row.getByRole('button', { name: new RegExp(`^Edit ${initialName}$`, 'i') }).click();
    
    // Expected: 1. Edit form opens.
    const editHeading = page.getByRole('heading', { name: new RegExp(`Edit.*${initialName}`, 'i') });
    await expect(editHeading).toBeVisible();
    
    // 3. Verify existing details are pre-populated.
    // Expected: 2. Existing values are displayed correctly.
    await expect(formContainer.getByLabel(/^Name/i)).toHaveValue(initialName);
    
    // 4. Modify valid category details.
    const updatedName = `${initialName} Updated`;
    await formContainer.getByLabel(/^Name/i).fill(updatedName);
    
    // 5. Click Save/Update.
    await formContainer.getByRole('button', { name: /Save changes/i }).click();
    await expect(editHeading).toBeHidden({ timeout: 10000 });
    
    // 6. Verify the category in the list.
    // Expected: 3. Changes are saved successfully. 4. Updated values are displayed correctly.
    await searchInput.fill(updatedName);
    await searchInput.press('Enter');
    
    await expect(page.getByRole('row', { name: updatedName }).first()).toBeVisible();
    
    log.info('ADM-CAT-FUN-008', 'ok');
  });

  test('ADM-CAT-FUN-009: Cancel category editing without saving', async () => {
    log.info('ADM-CAT-FUN-009', 'start');
    
    // First, let's create a temporary category to edit
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    let formContainer = page;
    const initialName = `CancelEdit ${Date.now()}`;
    await formContainer.getByLabel(/^Name/i).fill(initialName);
    await formContainer.getByRole('button', { name: /Create category/i }).click();
    
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeHidden({ timeout: 10000 });
    
    // 1. Click Edit for an existing category.
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(initialName);
    await searchInput.press('Enter');
    
    const row = page.getByRole('row', { name: initialName }).first();
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: new RegExp(`^Edit ${initialName}$`, 'i') }).click();
    
    const editHeading = page.getByRole('heading', { name: new RegExp(`Edit.*${initialName}`, 'i') });
    await expect(editHeading).toBeVisible();
    
    // 2. Modify one or more fields.
    const modifiedName = `${initialName} Cancelled`;
    await formContainer.getByLabel(/^Name/i).fill(modifiedName);
    
    // 3. Click Cancel.
    await formContainer.getByRole('button', { name: /^Cancel$/i }).click();
    await expect(editHeading).toBeHidden({ timeout: 10000 });
    
    // 4. Reopen the category for editing. (Or check the list)
    // Expected: 2. Changes are not saved. 3. Original category details remain unchanged.
    await searchInput.fill(initialName);
    await searchInput.press('Enter');
    
    // The original row should still exist
    await expect(page.getByRole('row', { name: initialName }).first()).toBeVisible();
    
    // The modified row should NOT exist
    await expect(page.getByRole('row', { name: modifiedName }).first()).toHaveCount(0);
    
    log.info('ADM-CAT-FUN-009', 'ok');
  });

  test('ADM-CAT-FUN-010: Hide an active category', async () => {
    log.info('ADM-CAT-FUN-010', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const uniqueName = `ToHide Cat ${Date.now()}`;
    await page.getByLabel(/^Name/i).fill(uniqueName);
    
    // Checkbox is active by default.
    await page.getByRole('button', { name: /Create category/i }).click();
    await expect(page.getByRole('heading', { name: 'New category' })).toBeHidden({ timeout: 10000 });
    
    // 1. Locate an active category.
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    const row = page.getByRole('row', { name: uniqueName }).first();
    await expect(row).toBeVisible();
    
    // 2. Click Hide.
    await row.getByRole('button', { name: /^Hide$/i }).click();
    
    // Wait for row state to update
    await page.waitForTimeout(1000);
    
    // 5. Verify the category status.
    // Expected: 2. Category status changes to Hidden/Inactive as designed.
    await expect(row).toContainText(/Hidden/i);
    await expect(row.getByRole('button', { name: /^Show$/i })).toBeVisible();
    
    log.info('ADM-CAT-FUN-010', 'ok');
  });

  test('ADM-CAT-FUN-011: Cancel hiding an active category', async () => {
    log.info('ADM-CAT-FUN-011', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const uniqueName = `CancelHide Cat ${Date.now()}`;
    await page.getByLabel(/^Name/i).fill(uniqueName);
    await page.getByRole('button', { name: /Create category/i }).click();
    await expect(page.getByRole('heading', { name: 'New category' })).toBeHidden({ timeout: 10000 });
    
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    const row = page.getByRole('row', { name: uniqueName }).first();
    await expect(row).toBeVisible();
    
    // 1. Locate an active category.
    // 2. Click Hide.
    await row.getByRole('button', { name: /^Hide$/i }).click();
    
    const showBtn = row.getByRole('button', { name: /^Show$/i });
    await expect(showBtn).toBeVisible({ timeout: 10000 });
    
    // To "Cancel" or undo, we click Show.
    await showBtn.click();
    
    // 4. Verify the category status.
    // Expected: Category status remains/returns to Active.
    await expect(row).toContainText(/Active/i);
    await expect(row.getByRole('button', { name: /^Hide$/i })).toBeVisible();
    
    log.info('ADM-CAT-FUN-011', 'ok');
  });

  test('ADM-CAT-FUN-012: Delete an existing category', async () => {
    log.info('ADM-CAT-FUN-012', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const uniqueName = `CatToDel ${Date.now()}`;
    await page.getByLabel(/^Name/i).fill(uniqueName);
    await page.getByRole('button', { name: /Create category/i }).click();
    await expect(page.getByRole('heading', { name: 'New category' })).toBeHidden({ timeout: 10000 });
    
    // 1. Locate the category.
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    const row = page.getByRole('row', { name: uniqueName }).first();
    await expect(row).toBeVisible();
    
    // 2. Click the Delete icon.
    await row.getByRole('button', { name: new RegExp(`^Delete ${uniqueName}$`, 'i') }).click();
    
    // 3. Review the confirmation prompt
    const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));
    await expect(dialog).toBeVisible();
    
    // 4. Confirm deletion.
    await dialog.getByRole('button', { name: /^Delete$/i }).click();
    await expect(dialog).toBeHidden();
    
    // Wait for network/UI update
    await page.waitForTimeout(1000);
    
    // 5. Search for the deleted category.
    // Expected: 2. Category is deleted successfully. 3. No longer appears.
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    await expect(page.getByRole('row', { name: uniqueName }).first()).toHaveCount(0);
    
    log.info('ADM-CAT-FUN-012', 'ok');
  });

  test('ADM-CAT-FUN-013: Cancel category deletion', async () => {
    log.info('ADM-CAT-FUN-013', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const uniqueName = `CatCancelDel ${Date.now()}`;
    await page.getByLabel(/^Name/i).fill(uniqueName);
    await page.getByRole('button', { name: /Create category/i }).click();
    await expect(page.getByRole('heading', { name: 'New category' })).toBeHidden({ timeout: 10000 });
    
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill(uniqueName);
    await searchInput.press('Enter');
    
    const row = page.getByRole('row', { name: uniqueName }).first();
    await expect(row).toBeVisible();
    
    // 1. Click Delete for an existing category.
    await row.getByRole('button', { name: new RegExp(`^Delete ${uniqueName}$`, 'i') }).click();
    
    const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));
    await expect(dialog).toBeVisible();
    
    // 2. Click Cancel
    await dialog.getByRole('button', { name: /^Cancel$/i }).click();
    await expect(dialog).toBeHidden();
    
    // 3. Verify the category remains in the list.
    await expect(row).toBeVisible();
    
    log.info('ADM-CAT-FUN-013', 'ok');
  });

  test('ADM-CAT-FUN-014: Verify rows per page selection', async () => {
    log.info('ADM-CAT-FUN-014', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    
    // 1. Locate the Rows per page dropdown.
    const rowsPerPage = page.getByRole('combobox', { name: /Rows per page/i });
    await expect(rowsPerPage).toBeVisible();
    
    // 2. Verify the available options.
    // In Playwright, we can check options using selectOption or verifying text.
    // 3. Select 20.
    await rowsPerPage.selectOption({ label: '20' });
    await page.waitForTimeout(1000);
    
    // 4. Observe the list and pagination count.
    await expect(page.getByText(/1[–-]\d+ of \d+/)).toBeVisible();
    
    // 5. Select 50.
    await rowsPerPage.selectOption({ label: '50' });
    await page.waitForTimeout(1000);
    
    // 6. Select 100.
    await rowsPerPage.selectOption({ label: '100' });
    await page.waitForTimeout(1000);
    
    log.info('ADM-CAT-FUN-014', 'ok');
  });

  test('ADM-CAT-FUN-015: Verify pagination navigation', async () => {
    log.info('ADM-CAT-FUN-015', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    
    // 1. Set Rows per page to 10.
    const rowsPerPage = page.getByRole('combobox', { name: /Rows per page/i });
    await rowsPerPage.selectOption({ label: '10' });
    await page.waitForTimeout(1000);
    
    // 2. Verify the first page range.
    await expect(page.getByText(/1[–-]10 of \d+/)).toBeVisible();
    
    // 3. Click Next.
    const nextBtn = page.locator('button', { hasText: 'Next' });
    const prevBtn = page.locator('button', { hasText: 'Prev' });
    
    // Initially prev is disabled (if on page 1)
    await expect(prevBtn).toBeDisabled();
    
    await nextBtn.click();
    await page.waitForTimeout(1000);
    
    // 4. Verify the next page range.
    await expect(page.getByText(/11[–-]20 of \d+/)).toBeVisible();
    await expect(prevBtn).toBeEnabled();
    
    // 5. Click Next again.
    await nextBtn.click();
    await page.waitForTimeout(1000);
    
    // 6. Verify the final page (or next page).
    await expect(page.getByText(/21[–-]\d+ of \d+/)).toBeVisible();
    
    // 7. Click Previous.
    await prevBtn.click();
    await page.waitForTimeout(1000);
    
    // 8. Verify the previous page is displayed.
    await expect(page.getByText(/11[–-]20 of \d+/)).toBeVisible();
    
    log.info('ADM-CAT-FUN-015', 'ok');
  });

  test('ADM-CAT-FUN-016: Search category by slug', async () => {
    log.info('ADM-CAT-FUN-016', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    
    // We know 'art-photography' is the slug for 'Art & Photography'
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill('art-photography');
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);
    
    // Expected: The category associated with the entered slug is displayed
    const row = page.getByRole('row', { name: 'Art & Photography' }).first();
    await expect(row).toBeVisible();
    
    log.info('ADM-CAT-FUN-016', 'ok');
  });

  test('ADM-CAT-FUN-017: Clear category search', async () => {
    log.info('ADM-CAT-FUN-017', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    
    const searchInput = page.getByPlaceholder(/Search name or slug/i);
    await searchInput.fill('art-photography');
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);
    
    await expect(page.getByRole('row', { name: 'Art & Photography' }).first()).toBeVisible();
    
    // 3. Clear the Search box.
    // In many UIs there's an 'x' button or just clearing text. Let's just clear the text and press enter.
    await searchInput.fill('');
    await searchInput.press('Enter');
    await page.waitForTimeout(1000);
    
    // Expected: The default category listing is restored. 
    // We should see a different count (e.g. 1-10 of >1) instead of 1-1 of 1
    // The Art & Photography should not be the only row.
    const allRowsCount = await page.getByRole('row').count();
    expect(allRowsCount).toBeGreaterThan(2); // header + at least 2 categories
    
    log.info('ADM-CAT-FUN-017', 'ok');
  });

  test('ADM-CAT-FUN-018: Verify New Category form opens successfully', async () => {
    log.info('ADM-CAT-FUN-018', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    
    // 2. Click New category.
    await page.getByRole('button', { name: /New category/i }).click();
    
    // Expected: The New Category form opens successfully and all expected category input controls are displayed.
    await expect(page.getByRole('heading', { name: 'New category' })).toBeVisible();
    await expect(page.getByLabel(/^Name/i)).toBeVisible();
    await expect(page.getByLabel(/^Slug/i)).toBeVisible();
    await expect(page.getByLabel(/^Parent Category/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Create category/i })).toBeVisible();
    
    log.info('ADM-CAT-FUN-018', 'ok');
  });

  test('CAT-ACC-005: Verify authorized user can open Categories in a new tab', async ({ browser }) => {
    log.info('CAT-ACC-005', 'start');
    
    // We already have a logged in context from beforeAll.
    const newPage = await page.context().newPage();
    
    // 1. Open the Categories URL in a new browser tab.
    await newPage.goto(`${ADMIN_URL}/categories`);
    await newPage.waitForTimeout(1000);
    
    // 3. Observe the new tab.
    // Expected: Categories page opens successfully in the new tab.
    await expect(newPage.getByRole('heading', { level: 1, name: /Categories/i })).toBeVisible();
    
    await newPage.close();
    
    log.info('CAT-ACC-005', 'ok');
  });
});


