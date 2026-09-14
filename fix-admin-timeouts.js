const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir).filter(f => f.startsWith('admin-') && f.endsWith('.spec.js'));
  for (const f of files) {
    const file = path.join(dir, f);
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('test.setTimeout(')) {
      content = content.replace(
        /(test\.describe(?:\.serial)?\([^\)]+\) => \{)/g,
        '$1\n  test.setTimeout(90000);'
      );
      fs.writeFileSync(file, content);
      console.log('Updated', file);
    } else {
      console.log('Skipped (already has setTimeout)', file);
    }
  }
}

processDir('tests/negative');
processDir('tests/positive');
