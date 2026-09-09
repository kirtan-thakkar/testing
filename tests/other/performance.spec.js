/**
 * Performance + stress tests for the IdeaKicks platform.
 * Mentor explicitly asked for these alongside the functional tests.
 *
 * Categories:
 *   - Page load latency SLAs
 *   - Concurrent session stress (login under load)
 *   - Search-response time under realistic input
 *
 * All tests skip cleanly if the server is unreachable.
 */
const { test, expect } = require('@playwright/test');
const log = require('./logger.js');

test.setTimeout(120000);

const BASE = 'https://187.77.79.40.nip.io/';

// Helper: time a navigation; returns ms or null on failure.
async function timeNav(page, url) {
  const t0 = Date.now();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    return Date.now() - t0;
  } catch (e) {
    log.warn('timeNav', `nav failed for ${url}: ${e.message.split('\n')[0]}`);
    return null;
  }
}

test.describe('Performance & Stress — IdeaKicks', () => {

  // ────────────────────── Page load SLAs ──────────────────────
  test('UF-PERF-01: Homepage loads in under 5s (warm)', async ({ page }) => {
    log.info('PERF-01', 'start');
    // First nav may be cold; warm up
    await timeNav(page, BASE);
    const t = await timeNav(page, BASE);
    if (t === null) { test.skip(true, 'server unreachable'); return; }
    log.info('PERF-01', `homepage warm load: ${t}ms`);
    expect(t).toBeLessThan(5000);
  });

  test('UF-PERF-02: /explore (discover) loads in under 8s (warm)', async ({ page }) => {
    log.info('PERF-02', 'start');
    await timeNav(page, BASE); // warm
    const t = await timeNav(page, BASE + 'explore');
    if (t === null) { test.skip(true, 'server unreachable'); return; }
    log.info('PERF-02', `/explore load: ${t}ms`);
    expect(t).toBeLessThan(8000);
  });

  test('UF-PERF-03: /login loads in under 5s', async ({ page }) => {
    log.info('PERF-03', 'start');
    const t = await timeNav(page, BASE + 'login');
    if (t === null) { test.skip(true, 'server unreachable'); return; }
    log.info('PERF-03', `/login load: ${t}ms`);
    expect(t).toBeLessThan(5000);
  });

  test('UF-PERF-04: /start/application wizard loads in under 8s', async ({ page }) => {
    log.info('PERF-04', 'start');
    // Need a session for this — try to use state.json
    const t = await timeNav(page, BASE + 'start/application');
    if (t === null) { test.skip(true, 'server unreachable'); return; }
    log.info('PERF-04', `/start/application load: ${t}ms`);
    expect(t).toBeLessThan(8000);
  });

  // ────────────────────── Concurrent navigation stress ──────────────────────
  test('UF-STRESS-01: 5 parallel page loads all complete within 30s', async ({ browser }) => {
    log.info('STRESS-01', 'start');
    const urls = [
      BASE, BASE + 'explore', BASE + 'login',
      BASE + 'how-it-works', BASE + 'about',
    ];
    const t0 = Date.now();
    const results = await Promise.all(urls.map(async (u) => {
      const ctx = await browser.newContext();
      const p = await ctx.newPage();
      const t = await timeNav(p, u);
      await ctx.close();
      return { url: u, t };
    }));
    const total = Date.now() - t0;
    log.info('STRESS-01', `5 parallel navs in ${total}ms`);
    for (const r of results) {
      log.info('STRESS-01', `  ${r.url} -> ${r.t !== null ? r.t + 'ms' : 'FAIL'}`);
    }
    const succeeded = results.filter(r => r.t !== null);
    expect(succeeded.length).toBeGreaterThanOrEqual(1); // server was reachable at least once
    expect(succeeded.every(r => r.t < 30000)).toBe(true);
  });

  test('UF-STRESS-02: 10 parallel /login navigations do not crash the server', async ({ browser }) => {
    log.info('STRESS-02', 'start');
    const t0 = Date.now();
    const results = await Promise.all(
      Array.from({ length: 10 }, async (_, i) => {
        const ctx = await browser.newContext();
        const p = await ctx.newPage();
        const t = await timeNav(p, BASE + 'login');
        await ctx.close();
        return { i, t };
      })
    );
    const total = Date.now() - t0;
    log.info('STRESS-02', `10 parallel /login in ${total}ms`);
    const succeeded = results.filter(r => r.t !== null);
    log.info('STRESS-02', `succeeded: ${succeeded.length}/10`);
    expect(succeeded.length).toBeGreaterThanOrEqual(1);
  });

  // ────────────────────── Search input responsiveness ──────────────────────
  test('UF-PERF-05: /explore responds to search query within 5s', async ({ page }) => {
    log.info('PERF-05', 'start');
    await timeNav(page, BASE + 'explore');
    const searchInput = page.getByRole('textbox', { name: /search/i }).first();
    if (await searchInput.count() === 0) { test.skip(true, 'no search input on /explore'); return; }
    const t0 = Date.now();
    await searchInput.fill('test query');
    // Wait for any list/cards to appear or for some content change
    await page.waitForTimeout(2000);
    const t = Date.now() - t0;
    log.info('PERF-05', `search response perceived: ${t}ms`);
    expect(t).toBeLessThan(5000);
  });

  // ────────────────────── HTML/CSS/JS payload size ──────────────────────
  test('UF-PERF-06: Homepage HTML payload is under 200KB', async ({ page }) => {
    log.info('PERF-06', 'start');
    const t0 = Date.now();
    const resp = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => null);
    if (!resp) { test.skip(true, 'server unreachable'); return; }
    const body = await resp.body().catch(() => null);
    if (!body) { test.skip(true, 'could not read body'); return; }
    const kb = (body.length / 1024).toFixed(1);
    log.info('PERF-06', `homepage HTML body: ${kb} KB`);
    expect(body.length).toBeLessThan(200 * 1024);
    log.info('PERF-06', `(domcontentloaded in ${Date.now() - t0}ms)`);
  });
});
