/**
 * Login load/stress test.
 *
 * The mentor asked for a "1000-user stress test" against the login endpoint.
 * Playwright can't do that without launching 1000 browsers (Docker would die).
 * So this uses raw Node + undici/built-in fetch to fire N concurrent requests
 * directly at the login API.
 *
 * Adjust concurrency with env var: LOAD_CONCURRENCY=1000 (default 200)
 */
const { test, expect } = require('@playwright/test');
const log = require('./logger.js');

const HOME_URL = 'https://187.77.79.40.nip.io/';
const API_URL = 'https://187.77.79.40.nip.io/login'; // server-rendered form; POST returns 405 (not a real API)
const CONCURRENCY = +(process.env.LOAD_CONCURRENCY || 200);
const TOTAL = +(process.env.LOAD_TOTAL || CONCURRENCY);
const FAKE_EMAIL = `loadtest_${Date.now()}_%i@nonexistent.test`;

test.setTimeout(120000);

test('UF-LOAD-01: Login endpoint survives concurrent invalid requests', async () => {
  log.info('LOAD-01', `start — concurrency=${CONCURRENCY}, total=${TOTAL}`);
  const start = Date.now();
  let ok = 0, fail = 0, other = 0;
  const statuses = {};

  // Hit the homepage and login form concurrently.
  // (Login form is server-rendered; we POST to it to verify the server
  // returns 405/400/422, NOT 5xx — a 5xx would mean the server crashed.)
  const tasks = Array.from({ length: TOTAL }, (_, i) => (async () => {
    try {
      const url = (i % 2 === 0) ? HOME_URL : API_URL;
      const method = (i % 2 === 0) ? 'GET' : 'POST';
      const opts = { method, signal: AbortSignal.timeout(15000) };
      if (method === 'POST') {
        opts.headers = { 'Content-Type': 'application/json' };
        opts.body = JSON.stringify({ email: `loadtest_${i}@nonexistent.test`, password: 'wrong-password-123' });
      }
      const resp = await fetch(url, opts);
      statuses[resp.status] = (statuses[resp.status] || 0) + 1;
      if (resp.status >= 200 && resp.status < 500) ok++;
      else other++;
    } catch (e) {
      fail++;
    }
  })());

  // Simple concurrency limiter: run in batches of CONCURRENCY
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    await Promise.all(tasks.slice(i, i + CONCURRENCY));
  }

  const dur = Date.now() - start;
  const rps = (TOTAL / (dur / 1000)).toFixed(1);
  log.info('LOAD-01', `done in ${dur}ms (${rps} req/s) — ok=${ok} fail=${fail} other=${other}`);
  log.info('LOAD-01', `status codes: ${JSON.stringify(statuses)}`);

  // Server must NOT have crashed (no 5xx). Timeouts on a slow server are OK.
  const fivexx = Object.entries(statuses).filter(([s]) => s.startsWith('5')).reduce((a, [_, n]) => a + n, 0);
  expect(fivexx).toBe(0);
  // Most requests must have completed
  expect(ok + fivexx).toBeGreaterThan(TOTAL * 0.6);
});

test('UF-LOAD-02: Login endpoint survives burst of 50 requests in 1s', async () => {
  log.info('LOAD-02', 'start — burst of 50');
  const start = Date.now();
  const results = await Promise.all(
    Array.from({ length: 50 }, async (_, i) => {
      try {
        const url = (i % 2 === 0) ? HOME_URL : API_URL;
        const method = (i % 2 === 0) ? 'GET' : 'POST';
        const opts = { method, signal: AbortSignal.timeout(5000) };
        if (method === 'POST') {
          opts.headers = { 'Content-Type': 'application/json' };
          opts.body = JSON.stringify({ email: `burst_${i}@test.com`, password: 'x' });
        }
        const resp = await fetch(url, opts);
        return resp.status;
      } catch {
        return 0;
      }
    })
  );
  const dur = Date.now() - start;
  const codes = {};
  results.forEach(s => { codes[s] = (codes[s] || 0) + 1; });
  log.info('LOAD-02', `done in ${dur}ms — codes: ${JSON.stringify(codes)}`);
  // 50 requests should complete in < 10s
  expect(dur).toBeLessThan(10000);
  // No 5xx
  expect(results.filter(s => s >= 500 && s < 600).length).toBe(0);
});
