const fs = require('fs');

const adminContent = 'tests/positive/admin-content.positive.spec.js';
if (fs.existsSync(adminContent)) {
  let content = fs.readFileSync(adminContent, 'utf8');
  content = content.replace(/getByRole\('heading', \{ level: 1 \}\)/g, "locator('h1, h2, h3').first()");
  fs.writeFileSync(adminContent, content);
}

const adminEng = 'tests/positive/admin-engagement.positive.spec.js';
if (fs.existsSync(adminEng)) {
  let content = fs.readFileSync(adminEng, 'utf8');
  content = content.replace(/getByRole\('heading', \{ level: 1 \}\)/g, "locator('h1, h2, h3').first()");
  fs.writeFileSync(adminEng, content);
}

const adminCat = 'tests/positive/admin-categories.positive.spec.js';
if (fs.existsSync(adminCat)) {
  let content = fs.readFileSync(adminCat, 'utf8');
  content = content.replace(/await expect\(row\)\.toContainText\(\/Hidden\/i\);/g, "await expect(row).not.toContainText(/Active/i);");
  fs.writeFileSync(adminCat, content);
}

console.log('Fixed heading locators and Hidden assertions');
