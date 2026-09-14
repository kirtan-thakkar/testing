const fs = require('fs');

function removeWatchdog(file) {
  let c = fs.readFileSync(file, 'utf8');
  // Remove the block from: const watchdog = setTimeout(() => { ... to testInfo._watchdog = watchdog;
  c = c.replace(/\/\/ Per-test timeout handler[\s\S]*?testInfo\._watchdog = watchdog;\n\s*\}/g, '}');
  c = c.replace(/\s*\/\/ Watchdog fires 5s BEFORE[\s\S]*?testInfo\._watchdog = watchdog;/g, '');
  c = c.replace(/\s*\/\/ Per-test watchdog[\s\S]*?testInfo\._watchdog = watchdog;/g, '');
  
  c = c.replace(/if \(testInfo\._watchdog\) clearTimeout\(testInfo\._watchdog\);/g, '');
  fs.writeFileSync(file, c);
}

removeWatchdog('tests/negative/wizard-application.negative.spec.js');
removeWatchdog('tests/negative/wizard-step2-uploads.negative.spec.js');
console.log('Removed watchdogs');
