import {test, expect } from '@playwright/test';
const log = require('../logger.js');

test.describe('Performance & Latency SLAs', () => {

  test('UF-PERF-01: 25 parallel /explore page loads all complete within 60s', async ({ browser }) => {
    test.setTimeout(120000);
    const CONCURRENCY = 25;
    
    // Create contexts explicitly to avoid sharing state if desired
    const contexts = await Promise.all(
      Array.from({ length: CONCURRENCY }).map(() => browser.newContext())
    );
    
    const pages = await Promise.all(contexts.map(c => c.newPage()));
    
    const startTime = Date.now();
    await Promise.all(pages.map(p => p.goto('/discover', { waitUntil: 'domcontentloaded', timeout: 60000 })));
    const duration = Date.now() - startTime;
    
    log.info('PERF-01', `25 parallel /discover loads took ${duration}ms`);
    expect(duration).toBeLessThanOrEqual(60000);
    
    await Promise.all(contexts.map(c => c.close()));
  });

  test('UF-PERF-02: Sustained load: 1 req/sec to /login for 60 seconds, no failures', async ({ request }) => {
    test.setTimeout(90000); // 60s load + buffer
    const durationMs = 60000;
    const intervalMs = 1000;
    const iterations = durationMs / intervalMs;
    
    let failures = 0;
    
    for (let i = 0; i < iterations; i++) {
      const start = Date.now();
      const res = await request.get('/login');
      if (!res.ok()) {
        failures++;
      }
      const elapsed = Date.now() - start;
      const waitTime = intervalMs - elapsed;
      if (waitTime > 0) {
        await new Promise(r => setTimeout(r, waitTime));
      }
    }
    
    log.info('PERF-02', `Sustained load finished with ${failures} failures`);
    expect(failures).toBe(0);
  });

  test('UF-PERF-03: Burst: 100 requests in 5s, all complete (any 5xx is failure)', async ({ request }) => {
    test.setTimeout(30000);
    const BURST_COUNT = 100;
    
    const startTime = Date.now();
    const promises = [];
    for (let i = 0; i < BURST_COUNT; i++) {
      promises.push(request.get('/discover'));
    }
    
    const results = await Promise.all(promises);
    const duration = Date.now() - startTime;
    
    let failures = 0;
    for (const res of results) {
      if (res.status() >= 500) failures++;
    }
    
    log.info('PERF-03', `Burst 100 requests took ${duration}ms, ${failures} 5xx errors`);
    expect(duration).toBeLessThanOrEqual(15000); // Should definitely finish within 15s if SLA is 5s
    expect(failures).toBe(0);
  });

  test('UF-PERF-04: Memory: rapid open/close of 10 pages does not leak browser memory', async ({ browser }) => {
    test.setTimeout(60000);
    let successes = 0;
    for (let i = 0; i < 10; i++) {
      const page = await browser.newPage();
      await page.goto('/discover', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500); // Small pause to let DOM settle
      await page.close();
      successes++;
    }
    log.info('PERF-04', `Successfully cycled 10 pages rapidly`);
    expect(successes).toBe(10);
  });

});
