const fs = require('fs');

let content = fs.readFileSync('tests/wizard-helpers.js', 'utf8');
content = content.replace(/getByRole\('button', \{ name: 'Settings' \}\)/g, "getByRole('link', { name: /Settings/i })");
fs.writeFileSync('tests/wizard-helpers.js', content);
console.log('Fixed Settings locator in wizard-helpers.js');
