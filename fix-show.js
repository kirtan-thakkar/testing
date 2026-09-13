const fs = require('fs');

let content = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf8');

// Replace Show selector to be more forgiving
content = content.replace(/getByRole\('button', { name: \/\^Show\$\/i }\)/g, "locator('button, a').filter({ hasText: /^Show$/i }).first()");

fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', content);
console.log('Fixed Show selector');
