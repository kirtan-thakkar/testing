const fs = require('fs');
const path = require('path');

function fixMemoryLeak(dir) {
  const files = fs.readdirSync(dir).filter(f => f.startsWith('admin-') && f.endsWith('.spec.js'));
  for (const f of files) {
    const file = path.join(dir, f);
    let content = fs.readFileSync(file, 'utf8');

    // Make sure we have let page; let adminContext;
    if (content.includes('let page;') && !content.includes('let adminContext;')) {
      content = content.replace(/let page;/, 'let page;\n  let adminContext;');
    }
    
    // Make sure beforeAll stores adminContext
    if (content.includes('page = r.page;') && !content.includes('adminContext = r.context;')) {
      content = content.replace(/page = r\.page;/, 'page = r.page;\n    adminContext = r.context;');
    }
    
    // Make sure afterAll closes adminContext
    if (content.includes('test.afterAll(async () => { if (page) await page.close(); });') && !content.includes('adminContext.close()')) {
      content = content.replace(
        /test\.afterAll\(async \(\) => \{ if \(page\) await page\.close\(\); \}\);/,
        'test.afterAll(async () => { if (page) await page.close(); if (adminContext) await adminContext.close(); });'
      );
    }
    
    fs.writeFileSync(file, content);
    console.log('Fixed memory leak in', file);
  }
}

fixMemoryLeak('tests/negative');
fixMemoryLeak('tests/positive');
