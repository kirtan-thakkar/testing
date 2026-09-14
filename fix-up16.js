const fs = require('fs');

let c = fs.readFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', 'utf8');

c = c.replace(
  /const galleryInput = page\.locator\('input\[type=file\]\[accept\*\="video"\]'\);\r?\n\s*await galleryInput\.setInputFiles\(NINETY_NINE_MB\);/g,
  `const videoInput = page.locator('input[type=file][accept*="video"]');
    await videoInput.setInputFiles(NINETY_NINE_MB);`
);

fs.writeFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', c);
console.log('Fixed UF-UP-16-P');
