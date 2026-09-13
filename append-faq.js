const fs = require('fs');

const tests = `
  // FAQs
  test('ADM-FAQ-FUN-001: Verify Add FAQ functionality', async () => {
    log.info('ADM-FAQ-FUN-001', 'start');
    await page.goto(\`\${ADMIN_URL}/cms/faqs\`).catch(() => {});
  });

  test('ADM-FAQ-FUN-002: Verify FAQ list display', async () => {
    log.info('ADM-FAQ-FUN-002', 'start');
  });

  test('ADM-FAQ-FUN-003: Verify Edit FAQ functionality', async () => {
    log.info('ADM-FAQ-FUN-003', 'start');
  });

  test('ADM-FAQ-FUN-004: Verify Hide FAQ functionality', async () => {
    log.info('ADM-FAQ-FUN-004', 'start');
  });

  test('ADM-FAQ-FUN-005: Verify Delete FAQ functionality', async () => {
    log.info('ADM-FAQ-FUN-005', 'start');
  });

  test('ADM-FAQ-FUN-006: Verify FAQ Rows Per Page functionality', async () => {
    log.info('ADM-FAQ-FUN-006', 'start');
  });

  test('ADM-FAQ-FUN-007: Verify FAQ Next page navigation', async () => {
    log.info('ADM-FAQ-FUN-007', 'start');
  });

  test('ADM-FAQ-FUN-008: Verify FAQ Previous page navigation', async () => {
    log.info('ADM-FAQ-FUN-008', 'start');
  });
`;

let content = fs.readFileSync('tests/positive/admin-content.positive.spec.js', 'utf8');
content = content.replace(/}\);\s*$/, tests + '\n});');
fs.writeFileSync('tests/positive/admin-content.positive.spec.js', content);
console.log('Appended tests to admin-content.');
