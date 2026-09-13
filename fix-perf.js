const fs = require('fs');
let content = fs.readFileSync('tests/performance.spec.js', 'utf8');
content = content.replace(/require\('\.\.\/logger\.js'\)/g, "require('./logger.js')");
fs.writeFileSync('tests/performance.spec.js', content);
console.log('Fixed logger path in performance.spec.js');
