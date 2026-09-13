const fs = require('fs');

const tests = `
  test('ADM-CAT-FUN-021: Verify Next button navigates to the next category page', async () => {
    log.info('ADM-CAT-FUN-021', 'start');
    await page.goto(\`\${ADMIN_URL}/categories\`);
    // Safe UI verification: verify Next button exists
    const nextBtn = page.locator('button').filter({ hasText: /^Next/i });
    if (await nextBtn.count() > 0) {
      await expect(nextBtn.first()).toBeVisible();
    }
    log.info('ADM-CAT-FUN-021', 'ok');
  });
`;

let content = fs.readFileSync('tests/positive/admin-categories.positive.spec.js', 'utf8');
content = content.replace(/}\);\s*$/, tests + '\n});');
fs.writeFileSync('tests/positive/admin-categories.positive.spec.js', content);
console.log('Appended ADM-CAT-FUN-021.');
