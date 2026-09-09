import { test, expect } from '@playwright/test';

test.describe.serial('Admin Campaigns Section', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://admin.187.77.79.40.nip.io/login');
    await page.getByRole('textbox', { name: 'Email' }).fill('hello@ideakicks.com');
    await page.getByRole('textbox', { name: 'Password' }).fill(`r9Ff{A0Z'kY:{V1W`);
    await page.getByRole('button', { name: 'Sign in' }).click({ force: true });
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    if (page) await page.close();
  });

  test('UF-ADMIN-01: Admin View Project Submissions', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/projects');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { name: 'Project Submissions' })).toBeVisible();
    await expect(page.locator('body')).toContainText(/No submissions|Review/i);
  });

  test('UF-ADMIN-02: Admin Filter Project Submissions', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/projects');
    await page.waitForLoadState('networkidle');
    
    const filterCombobox = page.getByRole('combobox', { name: 'Filter by status' });
    if (await filterCombobox.isVisible()) {
      await filterCombobox.selectOption({ label: 'All statuses' });
      await page.waitForLoadState('networkidle');
    }
    await expect(page.getByRole('heading', { name: 'Project Submissions' })).toBeVisible();
  });

  test('UF-ADMIN-03: Admin Search & Filter Campaigns', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/campaigns');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { name: 'Campaigns' })).toBeVisible();
    
    const searchInput = page.getByRole('textbox', { name: /Search by campaign name/i });
    if (await searchInput.isVisible()) {
      await searchInput.fill('solar');
      await expect(page.locator('body')).toContainText(/solar/i);
      await searchInput.fill('');
    }
    
    const statusFilter = page.getByRole('combobox', { name: 'Filter by status' });
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption({ label: 'Active' });
      await page.waitForLoadState('networkidle');
    }
  });

  test('UF-ADMIN-04: Admin Categories Page', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/categories');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const newCategoryBtn = page.getByRole('button', { name: /New category/i });
    if (await newCategoryBtn.isVisible()) {
      await expect(newCategoryBtn).toBeEnabled();
    }
  });

  test('UF-ADMIN-05: Admin Application Fields Page', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/country-fields');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('UF-ADMIN-06: Admin View Partners Tab', async () => {
    await page.goto('https://admin.187.77.79.40.nip.io/partners');
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByRole('heading', { name: 'Partner Applications' })).toBeVisible();
    
    const mentorsBtn = page.getByRole('button', { name: 'Mentors' });
    if (await mentorsBtn.isVisible()) {
      await mentorsBtn.click();
      await expect(page.getByText(/No applications/i)).toBeVisible();
    }
    
    const vendorsBtn = page.getByRole('button', { name: 'Vendors' });
    if (await vendorsBtn.isVisible()) {
      await vendorsBtn.click();
      await expect(page.getByText(/No applications/i)).toBeVisible();
    }
    
    const investorsBtn = page.getByRole('button', { name: 'Investors' });
    if (await investorsBtn.isVisible()) {
      await investorsBtn.click();
      await expect(page.getByText(/No applications/i)).toBeVisible();
    }
  });
});
