const fs = require('fs');

let content = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf8');

// Replace the hiding part in ADM-CAT-FUN-019 and 020
content = content.replace(/await row\.getByRole\('button', { name: \/\^Hide\$\/i }\)\.click\(\);\s*const dialog = page\.getByRole\('alertdialog'\)\.or\(page\.getByRole\('dialog'\)\);\s*await dialog\.getByRole\('button', { name: \/\^Hide\$\/i }\)\.click\(\);\s*await expect\(dialog\)\.toBeHidden\(\);\s*await page\.waitForTimeout\(1000\);\s*\/\/ Now Show it/g, 
  "const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));\n    // It's already Hidden by default, so we just Show it");

// Same for ADM-CAT-FUN-020 (replace the block)
content = content.replace(/await row\.getByRole\('button', { name: \/\^Hide\$\/i }\)\.click\(\);\s*const dialog = page\.getByRole\('alertdialog'\)\.or\(page\.getByRole\('dialog'\)\);\s*await dialog\.getByRole\('button', { name: \/\^Hide\$\/i }\)\.click\(\);\s*await expect\(dialog\)\.toBeHidden\(\);\s*await page\.waitForTimeout\(1000\);\s*\/\/ Attempt to show it, but cancel/g, 
  "const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));\n    // Attempt to show it, but cancel");

fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', content);
console.log('Fixed Hide->Show logic');
