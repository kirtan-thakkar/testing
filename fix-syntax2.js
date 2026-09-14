const fs = require('fs');

let code = fs.readFileSync('tests/negative/wizard-application.negative.spec.js', 'utf8').replace(/\r\n/g, '\n');

const search = `      await dismissCookies(page);
      
      await fillStep1(page);
      const btn = page.getByRole('button', { name: /^Continue/i });
      await Promise.all([btn.click(), btn.click().catch(() => {})]);
      await page.waitForTimeout(2500);
      const onStep3 = await page.getByText(/Step 3 of 4/i).isVisible().catch(() => false);
      log.info('WIZ-22-N', \`after double-click: onStep3=\${onStep3} (expected false)\`);
      expect(onStep3).toBe(false);
    });
  });`;

if (code.includes(search)) {
  code = code.replace(search, '');
  fs.writeFileSync('tests/negative/wizard-application.negative.spec.js', code);
  console.log('Fixed syntax error!');
} else {
  console.log('Search string not found!');
}
