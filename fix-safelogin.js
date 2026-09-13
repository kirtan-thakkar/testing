const fs = require('fs');

let content = fs.readFileSync('tests/positive/wizard-application.positive.spec.js', 'utf8');
content = content.replace(
  /const \{ login, dismissCookies, fillStep1, wizardAlreadySubmitted \} = require\('\.\.\/wizard-helpers\.js'\);/g,
  "const { login, dismissCookies, fillStep1, wizardAlreadySubmitted, safeLogin } = require('../wizard-helpers.js');"
);
fs.writeFileSync('tests/positive/wizard-application.positive.spec.js', content);
console.log('Fixed safeLogin import');
