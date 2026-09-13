const fs = require('fs');

function fixSpec(filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(/fs\.readdirSync\(PUBLIC_DIR\)/g, "(fs.existsSync(PUBLIC_DIR) ? fs.readdirSync(PUBLIC_DIR) : [])");
  fs.writeFileSync(filename, content);
  console.log('Fixed', filename);
}

fixSpec('tests/positive/wizard-step2-uploads.positive.spec.js');
fixSpec('tests/negative/wizard-step2-uploads.negative.spec.js');
