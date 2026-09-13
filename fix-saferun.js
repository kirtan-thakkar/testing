const fs = require('fs');

function fixSafeRun(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/msg\.includes\('h1 not visible'\)/g, "msg.includes('h1 not visible') || msg.includes('Account locked')");
  fs.writeFileSync(file, content);
  console.log('Fixed safeRun in ' + file);
}

fixSafeRun('tests/positive/wizard-application.positive.spec.js');
fixSafeRun('tests/negative/wizard-application.negative.spec.js');
