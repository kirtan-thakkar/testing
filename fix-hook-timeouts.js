const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir).filter(f => f.startsWith('admin-') && f.endsWith('.spec.js'));
  for (const f of files) {
    const file = path.join(dir, f);
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if beforeAll has setTimeout
    if (content.includes('test.beforeAll(') && !content.includes('test.setTimeout(90000); // hook timeout')) {
      content = content.replace(
        /test\.beforeAll\(async \(\{ browser \}\) => \{/g,
        'test.beforeAll(async ({ browser }) => {\n    test.setTimeout(90000); // hook timeout'
      );
      content = content.replace(
        /test\.beforeAll\(async \(\) => \{/g,
        'test.beforeAll(async () => {\n    test.setTimeout(90000); // hook timeout'
      );
      fs.writeFileSync(file, content);
      console.log('Added hook timeout to', file);
    }
  }
}

processDir('tests/negative');
processDir('tests/positive');
