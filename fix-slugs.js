const fs = require('fs');

let c = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf8');

c = c.replace(
  /await formContainer\.getByLabel\(\/\^Name\/i\)\.fill\(name\);\n(.*)await formContainer\.getByLabel\(\/\^Sort order\/i\)/g,
  `await formContainer.getByLabel(/^Name/i).fill(name);\n$1await formContainer.getByLabel(/^Slug/i).fill(name.toLowerCase().replace(/ /g, '-'));\n$1await formContainer.getByLabel(/^Sort order/i)`
);

c = c.replace(
  /const uniqueName = \`Test Inactive Cat \$\{Date\.now\(\)\}\`;\n\s*await formContainer\.getByLabel\(\/\^Name\/i\)\.fill\(uniqueName\);\n\s*\/\/ Slug will auto-fill, we'll leave it\./g,
  `const uniqueName = \`Test Inactive Cat \$\{Date.now()\}\`;
    await formContainer.getByLabel(/^Name/i).fill(uniqueName);
    await formContainer.getByLabel(/^Slug/i).fill(uniqueName.toLowerCase().replace(/ /g, '-'));`
);

c = c.replace(
  /const initialName = \`EditCat \$\{Date\.now\(\)\}\`;\n\s*await formContainer\.getByLabel\(\/\^Name\/i\)\.fill\(initialName\);\n\s*await formContainer\.getByRole\('button', \{ name: \/Create category\/i \}\)\.click\(\);/g,
  `const initialName = \`EditCat \$\{Date.now()\}\`;
    await formContainer.getByLabel(/^Name/i).fill(initialName);
    await formContainer.getByLabel(/^Slug/i).fill(initialName.toLowerCase().replace(/ /g, '-'));
    await formContainer.getByRole('button', { name: /Create category/i }).click();`
);

c = c.replace(
  /const initialName = \`CancelEdit \$\{Date\.now\(\)\}\`;\n\s*await formContainer\.getByLabel\(\/\^Name\/i\)\.fill\(initialName\);\n\s*await formContainer\.getByRole\('button', \{ name: \/Create category\/i \}\)\.click\(\);/g,
  `const initialName = \`CancelEdit \$\{Date.now()\}\`;
    await formContainer.getByLabel(/^Name/i).fill(initialName);
    await formContainer.getByLabel(/^Slug/i).fill(initialName.toLowerCase().replace(/ /g, '-'));
    await formContainer.getByRole('button', { name: /Create category/i }).click();`
);

fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', c);
console.log('Fixed missing slugs');
