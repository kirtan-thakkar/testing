const fs = require('fs');

let c = fs.readFileSync('tests/wizard-helpers.js', 'utf8');
c = c.replace(
  /await panInput\.blur\(\);\r?\n\}/g,
  `await panInput.blur();\n  // Give auto-save a moment to finish so "Continue" button is fully active\n  await page.waitForTimeout(2000);\n}`
);
fs.writeFileSync('tests/wizard-helpers.js', c);

console.log('Added wait after blur');
