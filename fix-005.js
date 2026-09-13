const fs = require('fs');

let content = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf8');

// In ADM-CAT-FUN-005, add Slug and Sort order
content = content.replace(
  /const uniqueName = `Icon Cat \$\{Date\.now\(\)\}`;[^]*?await formContainer\.getByLabel\(\/\^Name\/i\)\.fill\(uniqueName\);/,
  "const uniqueName = `Icon Cat ${Date.now()}`;\n    await formContainer.getByLabel(/^Name/i).fill(uniqueName);\n    await formContainer.getByLabel(/^Slug/i).fill(`icon-cat-${Date.now()}`);\n    await formContainer.getByLabel(/^Sort order/i).fill('1');"
);

// In ADM-CAT-FUN-006, add Slug and Sort order
content = content.replace(
  /const uniqueNameInactive = `Inactive Cat \$\{Date\.now\(\)\}`;[^]*?await formContainer\.getByLabel\(\/\^Name\/i\)\.fill\(uniqueNameInactive\);/,
  "const uniqueNameInactive = `Inactive Cat ${Date.now()}`;\n      await formContainer.getByLabel(/^Name/i).fill(uniqueNameInactive);\n      await formContainer.getByLabel(/^Slug/i).fill(`inactive-cat-${Date.now()}`);\n      await formContainer.getByLabel(/^Sort order/i).fill('1');"
);

fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', content);
console.log('Fixed missing required fields in 005 and 006');
