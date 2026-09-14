const fs = require('fs');

let c = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf8');

c = c.replace(
  /await expect\(page\.getByRole\('heading', \{ name: 'New category' \}\)\)\.toBeHidden\(\{ timeout: 10000 \}\);/g,
  `try {
    await expect(page.getByRole('heading', { name: 'New category' })).toBeHidden({ timeout: 2000 });
  } catch(e) {
    await page.screenshot({ path: 'scratch/modal-error.png' });
    throw e;
  }`
);

fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', c);
console.log('Patched ADM-CAT-FUN-004 to take screenshot');
