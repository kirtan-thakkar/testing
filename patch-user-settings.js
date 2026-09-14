const fs = require('fs');

let code = fs.readFileSync('tests/positive/user-settings.positive.spec.js', 'utf8');

if (!code.includes("const fs = require('fs')")) {
  code = "const fs = require('fs');\n" + code;
}

code = code.replace(
  /process\.env\.USER_EMAIL \|\| 'dummy1@gmail\.com'/g,
  "process.env.USER_EMAIL || (fs.existsSync('dummy_email.txt') ? fs.readFileSync('dummy_email.txt', 'utf8').trim() : 'dummy1@gmail.com')"
);

fs.writeFileSync('tests/positive/user-settings.positive.spec.js', code);
console.log('Patched user-settings.positive.spec.js');
