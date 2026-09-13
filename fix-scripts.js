const fs = require('fs');

const fixFile = (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  content = content.replace(/\\`/g, '`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(filepath, content);
};

fixFile('scripts/generate-fixtures.js');
fixFile('scripts/update-sheets.js');
console.log('Fixed escaped backticks in scripts.');
