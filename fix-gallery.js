const fs = require('fs');

let c = fs.readFileSync('tests/negative/wizard-step2-uploads.negative.spec.js', 'utf8');
// Only UP-06-N is a gallery upload in negative spec.
c = c.replace(
  /const galleryInput = page\.locator\('input\[type=file\]\[accept\*\="video"\]'\);\n\s*for \(let i = 0; i < 15; i\+\+\) \{/g,
  `const galleryInput = page.locator('input[type=file]').nth(1);\n      for (let i = 0; i < 15; i++) {`
);
fs.writeFileSync('tests/negative/wizard-step2-uploads.negative.spec.js', c);

let p = fs.readFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', 'utf8');
p = p.replace(
  /const galleryInput = page\.locator\('input\[type=file\]\[accept\*\="video"\]'\);\n\s*const imgs = ALL_IMAGES\.slice\(0, 3\);/g,
  `const galleryInput = page.locator('input[type=file]').nth(1);\n      const imgs = ALL_IMAGES.slice(0, 3);`
);
p = p.replace(
  /const galleryInput = page\.locator\('input\[type=file\]\[accept\*\="video"\]'\);\n\s*const imgs = ALL_IMAGES\.slice\(0, 12\);/g,
  `const galleryInput = page.locator('input[type=file]').nth(1);\n      const imgs = ALL_IMAGES.slice(0, 12);`
);
p = p.replace(
  /const galleryInput = page\.locator\('input\[type=file\]\[accept\*\="video"\]'\);\n\s*\/\/ Send image \+ video separately/g,
  `const galleryInput = page.locator('input[type=file]').nth(1);\n      const videoInput = page.locator('input[type=file][accept*="video"]');\n      // Send image + video separately`
);
p = p.replace(
  /await galleryInput\.setInputFiles\(SMALL_VIDEO\);/g,
  `await videoInput.setInputFiles(SMALL_VIDEO);`
);

fs.writeFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', p);
console.log('Fixed locators cleanly');
