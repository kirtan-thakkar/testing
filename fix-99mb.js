const fs = require('fs');

let content = fs.readFileSync('scripts/generate-fixtures.js', 'utf8');
content = content.replace(
  /\/\/ 1\. Create a 11MB file/g,
  "fs.writeFileSync(path.join(PUBLIC_DIR, 'dummy_99.mp4'), Buffer.alloc(99 * 1024 * 1024, 'V'));\n\n  // 1. Create a 11MB file"
);
fs.writeFileSync('scripts/generate-fixtures.js', content);
console.log('Fixed dummy_99.mp4 generation');
