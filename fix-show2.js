const fs = require('fs');

let content = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf8');

// Replace Show selector to be the simplest getByText
content = content.replace(/locator\('button, a'\)\.filter\({ hasText: \/\^Show\$\/i }\)/g, "getByText(/^Show$/i)");

fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', content);
console.log('Fixed Show selector to just getByText');
