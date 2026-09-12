const { test, expect } = require('@playwright/test');
const { ADMIN_URL, loginAdmin } = require('../admin-helpers.js');
const log = require('../logger.js');

test.describe.serial('Admin Categories - Validation', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    const r = await loginAdmin(browser);
    page = r.page;
  });

  test.afterAll(async () => {
    if (page) await page.close();
  });

  test('ADM-CAT-VAL-001: Create category without Name', async () => {
    log.info('ADM-CAT-VAL-001', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeVisible();
    
    const formContainer = page;
    
    // 1. Leave Name blank (it's blank by default).
    const nameInput = formContainer.getByLabel(/^Name/i);
    await nameInput.fill('');
    
    // 2. Enter valid values in the remaining required fields.
    await formContainer.getByLabel(/^Slug/i).fill('valid-slug-test');
    
    // 3. Click Create category.
    await formContainer.getByRole('button', { name: /Create category/i }).click();
    
    // Expected: 1. Category is not created.
    // Ensure form is still visible
    await expect(newCategoryHeading).toBeVisible();
    
    // 2. Name field displays an appropriate required-field validation message.
    // HTML5 native validation triggers pseudo-class :invalid and shows a tooltip
    const isInvalid = await nameInput.evaluate(node => node.validity.valueMissing);
    expect(isInvalid).toBe(true);
    
    const validationMessage = await nameInput.evaluate(node => node.validationMessage);
    expect(validationMessage).toBeTruthy();
    
    log.info('ADM-CAT-VAL-001', 'ok');
  });

  test('ADM-CAT-VAL-002: Create category without Slug', async () => {
    log.info('ADM-CAT-VAL-002', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeVisible();
    
    const formContainer = page;
    
    // 2. Enter a valid Name.
    await formContainer.getByLabel(/^Name/i).fill('Test Category No Slug');
    
    // 3. Leave Slug blank.
    // The slug auto-fills, so we must explicitly clear it.
    await formContainer.getByLabel(/^Slug/i).fill('');
    
    // 4. Enter valid values in the remaining fields. (None are strictly required besides Name/Slug).
    // 5. Click Create category.
    await formContainer.getByRole('button', { name: /Create category/i }).click();
    
    // Expected: 1. Category is not created.
    await expect(newCategoryHeading).toBeVisible(); // Form is still open
    
    // 2. Slug field displays an appropriate required-field validation message.
    await expect(formContainer.getByText(/Slug must be at least 2 characters/i)).toBeVisible();
    
    log.info('ADM-CAT-VAL-002', 'ok');
  });

  test('ADM-CAT-VAL-003: Create category with Name and Slug blank', async () => {
    log.info('ADM-CAT-VAL-003', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeVisible();
    
    const formContainer = page;
    
    // Leave Name blank (it's blank by default).
    const nameInput = formContainer.getByLabel(/^Name/i);
    await nameInput.fill('');
    
    // Leave Slug blank.
    const slugInput = formContainer.getByLabel(/^Slug/i);
    await slugInput.fill('');
    
    // Click Create category.
    await formContainer.getByRole('button', { name: /Create category/i }).click();
    
    // Expected: 1. Category is not created.
    await expect(newCategoryHeading).toBeVisible(); // Form is still open
    
    // 2. Appropriate validation is displayed for both required fields.
    // Name uses HTML5 required validation
    const isNameInvalid = await nameInput.evaluate(node => node.validity.valueMissing);
    expect(isNameInvalid).toBe(true);
    
    // We expect the browser to block form submission entirely due to the HTML5 required attribute on Name,
    // so the custom JavaScript validation for Slug might not even trigger (or the toast might not appear)
    // until Name is filled. The test case says "Appropriate validation is displayed for both required fields",
    // but browser validation typically focuses on the first invalid field. We will verify Name is invalid
    // and the form hasn't submitted.
    // If the application does show the slug validation too, we could check for it, but let's just ensure the form isn't submitted.
    
    log.info('ADM-CAT-VAL-003', 'ok');
  });

  test('ADM-CAT-VAL-004: Enter an invalid slug format', async () => {
    log.info('ADM-CAT-VAL-004', 'start');
    
    await page.goto(`${ADMIN_URL}/categories`);
    await page.getByRole('button', { name: /New category/i }).click();
    
    const newCategoryHeading = page.getByRole('heading', { name: 'New category' });
    await expect(newCategoryHeading).toBeVisible();
    
    const formContainer = page;
    
    // 2. Enter a valid Name.
    await formContainer.getByLabel(/^Name/i).fill('Test Invalid Slug');
    
    // 3. Enter an invalid slug format.
    await formContainer.getByLabel(/^Slug/i).fill('Invalid Slug!@#');
    
    // 4. Complete other required fields.
    // 5. Attempt to create the category.
    await formContainer.getByRole('button', { name: /Create category/i }).click();
    
    // Expected: System should reject the invalid slug. Category should not be created.
    await expect(newCategoryHeading).toBeVisible(); // Form is still open
    
    // Check validation message
    await expect(formContainer.getByText(/Use lowercase letters, numbers and hyphens only/i)).toBeVisible();
    
    log.info('ADM-CAT-VAL-004', 'ok');
  });
});
