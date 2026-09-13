const fs = require('fs');
let content = fs.readFileSync('tests/wizard-helpers.js', 'utf8');

// Replace all 5000 timeouts in fillStep1 with 15000
content = content.replace(/timeout: 5000/g, 'timeout: 25000');
content = content.replace(/timeout: 15000/g, 'timeout: 25000'); // Bump 15s to 25s for slow servers

fs.writeFileSync('tests/wizard-helpers.js', content);
console.log('Bumped all timeouts in wizard-helpers.js to 25000ms to handle staging server latency');
