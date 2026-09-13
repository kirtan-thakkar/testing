const fs = require('fs');

let content = fs.readFileSync('tests/wizard-helpers.js', 'utf8');

// Revert 25000 back to 5000
content = content.replace(/timeout: 25000/g, 'timeout: 5000');
// Revert the one 15000 to 15000
content = content.replace(/timeout: 10000/g, 'timeout: 10000'); // keep unchanged
// Wait, I blindly replaced all 5000 and 15000 to 25000 earlier! Let's just put them all back to 5000 for standard UI waits, and 15000 for navigations.
content = content.replace(/waitUntil: 'domcontentloaded', timeout: 5000/g, "waitUntil: 'domcontentloaded', timeout: 15000"); // Fix navigations
content = content.replace(/page\.waitForURL\(\/start\\\/application\/, \{ timeout: 5000 \}\)/g, "page.waitForURL(/start\\/application/, { timeout: 15000 })");

fs.writeFileSync('tests/wizard-helpers.js', content);
console.log('Reverted timeouts back to 5000ms');

let timeoutSpec = fs.readFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', 'utf8');
timeoutSpec = timeoutSpec.replace(/test\.setTimeout\(120000\);/g, 'test.setTimeout(50000);');
fs.writeFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', timeoutSpec);

let timeoutSpecNeg = fs.readFileSync('tests/negative/wizard-step2-uploads.negative.spec.js', 'utf8');
timeoutSpecNeg = timeoutSpecNeg.replace(/test\.setTimeout\(120000\);/g, 'test.setTimeout(50000);');
fs.writeFileSync('tests/negative/wizard-step2-uploads.negative.spec.js', timeoutSpecNeg);

console.log('Reverted test.setTimeout back to 50000');
