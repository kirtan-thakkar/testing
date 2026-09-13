const fs = require('fs');

let content = fs.readFileSync('tests/wizard-helpers.js', 'utf8');

content = content.replace(/getByRole\('textbox', \{ name: 'Email' \}\)/g, "getByRole('textbox', { name: /Email/i })");
content = content.replace(/getByRole\('textbox', \{ name: 'Password' \}\)/g, "getByRole('textbox', { name: /Password/i })");
content = content.replace(/getByRole\('button', \{ name: 'Log In' \}\)/g, "getByRole('button', { name: /Log In/i })");

fs.writeFileSync('tests/wizard-helpers.js', content);
console.log('Fixed login locators');
