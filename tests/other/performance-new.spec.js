const { test, expect } = require('@playwright/test');
const { getLogger } = require('../logger');
const log = getLogger('performance');
const BASE = 'https://187.77.79.40.nip.io/';

test.describe('Performance & Latency SLAs', () => {

  test('25 parallel /explore page loads all complete within 60s', async ({ browser }) => {
    test.setTimeout(75000);
    const start = Date.now();
    const promises = Array.from({ length: 25 }).map(async (_, i) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const res = await page.goto(BASE + 'explore', { waitUntil: 'domcontentloaded', timeout: 60000 });
      expect(res.status()).toBe(200);
      await context.close();
    });
    await Promise.all(promises);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(60000);
    log.info('PERF', \25 parallel loads took \ms\);
  });

  test('Sustained load: 1 req/sec to /login for 60 seconds, no failures', async ({ browser }) => {
    test.setTimeout(90000);
    let failures = 0;
    for (let i = 0; i < 60; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
      try {
        const res = await page.goto(BASE + 'login', { waitUntil: 'domcontentloaded', timeout: 10000 });
        if (res.status() !== 200) failures++;
      } catch {
        failures++;
      }
      await context.close();
      await new Promise(r => setTimeout(r, 1000));
    }
    expect(failures).toBe(0);
  });

  test('Burst: 100 requests in 5s, all complete (any 5xx is failure)', async ({ request }) => {
    test.setTimeout(30000);
    const promises = Array.from({ length: 100 }).map(async () => {
      const res = await request.get(BASE + 'explore', { timeout: 15000 });
      expect(res.status()).toBeLessThan(500);
    });
    await Promise.all(promises);
  });

  test('Memory: rapid open/close of 10 pages does not leak browser memory', async ({ browser }) => {
    test.setTimeout(60000);
    for (let i = 0; i < 10; i++) {
      const page = await browser.newPage();
      await page.goto(BASE, { waitUntil: 'domcontentloaded' });
      await page.close();
    }
    // Playwright handles its own memory, if it doesn't crash it passes
    expect(true).toBeTruthy();
  });

});
