const fs = require('fs');

let c = fs.readFileSync('tests/wizard-helpers.js', 'utf8');

// Replace the page.evaluate block for checkboxes
c = c.replace(
  /await page\.evaluate\(\(\) => \{[\s\S]*?\}\);\r?\n    \}\)/,
  `const cbs = page.locator('input[type="checkbox"]');
    const count = await cbs.count();
    for (let i = 0; i < count; i++) {
      await cbs.nth(i).check({ force: true });
    }`
);
fs.writeFileSync('tests/wizard-helpers.js', c);
console.log('Fixed checkbox logic');
