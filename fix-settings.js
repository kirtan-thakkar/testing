const fs = require('fs');

let content = fs.readFileSync('tests/positive/user-settings.positive.spec.js', 'utf8');
content = content.replace(/getByRole\('button', \{ name: 'Settings' \}\)/g, "getByRole('link', { name: /Settings/i })");
fs.writeFileSync('tests/positive/user-settings.positive.spec.js', content);
console.log('Fixed Settings locator');
