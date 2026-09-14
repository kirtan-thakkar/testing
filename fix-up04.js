const fs = require('fs');

let c = fs.readFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', 'utf8');

c = c.replace(
  /const galleryInput = page\.locator\('input\[type=file\]\[accept\*\="video"\]'\);\r?\n\s*\/\/ Send image \+ video separately since input is single-file\r?\n\s*await galleryInput\.setInputFiles\(IMG_SMALL\);\r?\n\s*await page\.waitForTimeout\(1500\);\r?\n\s*await videoInput\.setInputFiles\(SMALL_VIDEO\);/g,
  `const inputs = page.locator('input[type=file]');
    await inputs.first().waitFor({ state: 'attached' });
    let galleryInput = inputs.nth(1);
    const cnt = await inputs.count();
    let imgInputsFound = 0;
    for(let i=0; i<cnt; i++) {
       const acc = await inputs.nth(i).getAttribute('accept');
       if(acc && acc.includes('image')) {
          imgInputsFound++;
          if(imgInputsFound === 2) { galleryInput = inputs.nth(i); break; }
       }
    }
    const videoInput = page.locator('input[type=file][accept*="video"]');
    // Send image + video separately
    await galleryInput.setInputFiles(IMG_SMALL);
    await page.waitForTimeout(1500);
    await videoInput.setInputFiles(SMALL_VIDEO);`
);

fs.writeFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', c);
console.log('Fixed UF-UP-04-P');
