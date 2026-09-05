/**
 * Playwright config for the IdeaKicks test suite.
 * Uses CommonJS to match the rest of the project.
 */
const { defineConfig, devices } = require('@playwright/test');
const path = require('node:path');

module.exports = defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./tests/global-setup.js'),

  // Run tests sequentially to avoid DDOSing the auth endpoints.
  fullyParallel: false,

  // Don't allow test.only on CI.
  forbidOnly: !!process.env.CI,

  // Retry once on CI, never locally (avoid masking real failures).
  retries: process.env.CI ? 1 : 0,

  // One worker = sequential, no rate-limit issues on admin login.
  workers: 1,

  // Two reporters:
  //   1. list — Playwright's built-in console reporter
  //   2. ./tests/reporter.js — our custom logger + per-run summary + email HTML
  reporter: [
    ['list'],
    [path.resolve(__dirname, 'tests/reporter.js')],
  ],

  // Cap the wall-clock for the full run (in ms). 60 min default.
  timeout: 30000,         // per-test default (overridden in specific specs)
  globalTimeout: 60 * 60 * 1000,

  use: {
    baseURL: 'https://187.77.79.40.nip.io/',
    trace: 'on-first-retry',
    storageState: 'state.json',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Skip the .SKIPPED files (e.g. wizard-step3-4.sequential.spec.js.SKIPPED).
  testIgnore: /.*\.SKIPPED$/,
});
