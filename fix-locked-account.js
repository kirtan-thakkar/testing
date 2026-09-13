const fs = require('fs');

let content = fs.readFileSync('tests/wizard-helpers.js', 'utf8');

// Replace the logging of "user already has a submitted campaign" with an error throw so safeRun catches it
content = content.replace(
  /log\.warn\('wizard', 'user already has a submitted campaign [^']+'\);/,
  "log.warn('wizard', 'user already has a submitted campaign - wizard steps not reachable');\n        throw new Error('Account locked in Under Review state');"
);

// Also check for the text anywhere if the wizard loads and immediately shows Under Review
if (!content.includes('throw new Error(\'Account locked in Under Review state\')')) {
  console.log('Regex missed?');
}

fs.writeFileSync('tests/wizard-helpers.js', content);
console.log('Fixed wizard-helpers.js to throw when account is locked');
