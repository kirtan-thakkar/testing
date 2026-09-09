const fs = require('fs');
const path = require('path');

const catalog = require('c:/ideakicks/testing/tests/TEST_CATALOG.json');

function categorize(file, testTitle) {
  const f = file.toLowerCase();
  const t = testTitle.toLowerCase();
  if (t.includes('uf-perf') || t.includes('uf-load') || f.includes('login-load') || (f.includes('performance') && !t.includes('uf-stress'))) {
    return 'performance test';
  }
  if (t.includes('uf-stress') || t.includes('parallel') || t.includes('burst')) {
    return 'stress test';
  }
  if (f.includes('admin')) {
    if (f.includes('negative') || t.includes('-n') || t.includes('negative')) return 'admin neg';
    return 'admin pos';
  }
  if (f.includes('negative') || t.includes('-n') || t.includes('negative')) return 'user neg';
  return 'user pos';
}

function getModule(file, testTitle) {
  const f = file.toLowerCase();
  if (f.includes('admin-campaigns')) return 'Admin - Campaigns & Submissions';
  if (f.includes('admin-content')) return 'Admin - CMS & Settings';
  if (f.includes('admin-engagement')) return 'Admin - Inbox & Subscribers';
  if (f.includes('admin-finance')) return 'Admin - Finance & Payouts';
  if (f.includes('admin-people')) return 'Admin - Users & Roles';
  if (f.includes('admin-system')) return 'Admin - System & Activity';
  if (f.includes('auth')) return 'Authentication';
  if (f.includes('account')) return 'Account Management';
  if (f.includes('dashboard')) return 'Creator Dashboard';
  if (f.includes('discover')) return 'Explore & Search';
  if (f.includes('checkout')) return 'Pledge & Checkout';
  if (f.includes('campaign-details')) return 'Campaign Details';
  if (f.includes('campaign-creation')) return 'Campaign Application Entry';
  if (f.includes('wizard-application')) return 'Campaign Wizard - Step 1 Plan';
  if (f.includes('wizard-step2')) return 'Campaign Wizard - Step 2 Media & Pitch';
  if (f.includes('info-and-legal')) return 'Info & Legal Pages';
  if (f.includes('performance')) return 'Performance & Latency SLAs';
  if (f.includes('login-load')) return 'Load & Concurrency';
  return 'General Platform';
}

const rows = [
  ['Test ID', 'Category', 'Module', 'Test Name', 'Spec File', 'Automation Framework', 'Status', 'Reason / Scope']
];

catalog.forEach(item => {
  item.tests.forEach(testTitle => {
    const idMatch = testTitle.match(/^([A-Za-z0-9\-_]+):/);
    const testId = idMatch ? idMatch[1] : 'TEST-' + rows.length;
    const testName = idMatch ? testTitle.slice(idMatch[0].length).trim() : testTitle;
    const category = categorize(item.file, testTitle);
    const moduleName = getModule(item.file, testTitle);
    const specFile = item.file.replace(/\\/g, '/');
    const framework = 'Playwright (Chromium)';
    
    let status = 'Automated';
    let desc = `${moduleName}: Verifies ${testName.toLowerCase()}`;
    
    if (specFile.includes('wizard-application') || specFile.includes('wizard-step2')) {
       status = 'Skipped / Blocked';
       desc = 'Blocked by locked server state (the test account has already submitted a campaign in previous tests, locking it in Under Review state. New fresh account required to bypass this server blocker or backend fix needed)';
    }

    rows.push([
      `"${testId}"`,
      `"${category}"`,
      `"${moduleName}"`,
      `"${testName.replace(/"/g, '""')}"`,
      `"${specFile}"`,
      `"${framework}"`,
      `"${status}"`,
      `"${desc.replace(/"/g, '""')}"`
    ]);
  });
});

const csvContent = rows.map(r => r.join(',')).join('\n');
const outputPath = 'c:/ideakicks/testing/IDEA_KICKS_TEST_CASES_INVENTORY.csv';
fs.writeFileSync(outputPath, csvContent, 'utf8');
console.log(`Generated ${outputPath} with ${rows.length - 1} test records.`);
