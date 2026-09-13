const fs = require('fs');

let c = fs.readFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', 'utf8');
c = c.replace(
`    await fillStep1(page);
    await dismissCookies(page);
    
    // Send cover image first
    const coverInput = page.locator('input[type=file][accept*="image"]').first();
    await coverInput.setInputFiles(IMG_SMALL);
    await page.waitForTimeout(2000);
    await page.locator('button').filter({ hasText: /^Continue/i }).first().click({ force: true });
    await page.waitForTimeout(2000);

    const galleryInput = page.locator('input[type=file][accept*="video"]');`,
`    await fillStep1(page);
    await dismissCookies(page);
    await page.locator('button').filter({ hasText: /^Continue/i }).first().click({ force: true });
    await page.waitForTimeout(2000);
    
    // Send cover image first
    const coverInput = page.locator('input[type=file][accept*="image"]').first();
    await coverInput.setInputFiles(IMG_SMALL);
    await page.waitForTimeout(2000);

    const galleryInput = page.locator('input[type=file][accept*="video"]');`
);
fs.writeFileSync('tests/positive/wizard-step2-uploads.positive.spec.js', c);
console.log('Fixed UP-16-P');
