const fs = require('fs');

function fixGalleryLocator(file) {
  let c = fs.readFileSync(file, 'utf8');
  // For UP-02-P, UP-03-P, UP-06-N, UP-04-P, etc.
  c = c.replace(/const galleryInput = page\.locator\('input\[type=file\]\[accept\*\=\"video\"\]'\);/g, 
    `// Fallback locator to ensure we find the right input
    const inputs = page.locator('input[type=file]');
    const count = await inputs.count();
    let galleryInput = inputs.nth(Math.max(0, count - 1)); // Default to last input if unsure
    for (let j = 0; j < count; j++) {
      const accept = await inputs.nth(j).getAttribute('accept');
      // If it's a gallery image test, we want the image input that is NOT the cover
      if (accept && accept.includes('image') && j > 0) {
         galleryInput = inputs.nth(j);
         break;
      } else if (accept && accept.includes('video') && file.includes('video')) {
         galleryInput = inputs.nth(j);
         break;
      }
    }
  `);
  fs.writeFileSync(file, c);
}

fixGalleryLocator('tests/positive/wizard-step2-uploads.positive.spec.js');
fixGalleryLocator('tests/negative/wizard-step2-uploads.negative.spec.js');
console.log('Fixed locators');
