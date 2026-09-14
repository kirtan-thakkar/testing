const fs = require('fs');

function replaceLocator(file, testPrefix, oldLoc, newLoc) {
  let c = fs.readFileSync(file, 'utf8');
  const lines = c.split('\\n');
  let inTargetTest = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(testPrefix)) inTargetTest = true;
    else if (lines[i].includes("test('")) inTargetTest = false;
    
    if (inTargetTest && lines[i].includes(oldLoc)) {
      lines[i] = lines[i].replace(oldLoc, newLoc);
    }
  }
  fs.writeFileSync(file, lines.join('\\n'));
}

// In UP-02-P, gallery upload (images)
replaceLocator('tests/positive/wizard-step2-uploads.positive.spec.js', 'UP-02-P', 'input[type=file][accept*="video"]', 'input[type=file][accept*="image"]').first() /* fallback */);
