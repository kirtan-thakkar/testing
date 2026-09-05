/**
 * Custom Playwright reporter that:
 *   - Logs every test result to our logger (console + per-run log + rolling log)
 *   - Writes a run-summary block at the end
 *   - Generates an HTML report for emailing
 *
 * Configure in playwright.config.js:
 *   reporter: [['list'], ['./tests/reporter.js']]
 */
const fs = require('node:fs');
const path = require('node:path');
const log = require('./logger.js');

class IdeakicksReporter {
  onBegin(config, suite) {
    log.info('RUN-BEGIN',
      `Suite: ${suite.title || 'unnamed'} | ` +
      `Tests: ${suite.allTests().length} | ` +
      `Workers: ${config.workers} | ` +
      `Run log: ${log.getRunLogPath()}`);

    // Pre-create a minimal HTML report
    this.htmlPath = path.join(process.cwd(), 'logs', `run-${log.getRunId()}.html`);
    this.html = [
      '<!doctype html><html><head><meta charset="utf-8">',
      '<title>IdeaKicks Test Report</title>',
      '<style>',
      'body{font-family:system-ui,sans-serif;max-width:980px;margin:24px auto;padding:0 16px;color:#222}',
      'h1{font-size:20px;border-bottom:1px solid #ddd;padding-bottom:8px}',
      'h2{font-size:16px;margin-top:24px}',
      '.pass{color:#1a7f37} .fail{color:#cf222e} .skip{color:#9a6700}',
      '.summary{background:#f6f8fa;border:1px solid #d0d7de;border-radius:6px;padding:12px;font-family:monospace;white-space:pre-wrap}',
      'table{border-collapse:collapse;width:100%;font-size:13px}',
      'th,td{border:1px solid #d0d7de;padding:6px 8px;text-align:left;vertical-align:top}',
      'th{background:#f6f8fa}',
      'tr.fail td{background:#ffebe9} tr.skip td{background:#fff8c5} tr.pass td{background:#dafbe1}',
      '</style></head><body>',
      `<h1>IdeaKicks Test Report — ${log.getRunId()}</h1>`,
      '<div id="summary" class="summary">Running...</div>',
      '<h2>Results</h2><table><thead><tr><th>#</th><th>Test</th><th>Status</th><th>Duration</th><th>Error</th></tr></thead><tbody id="rows"></tbody></table>',
    ].join('\n');
    this.results = [];
  }

  onTestEnd(test, result) {
    const status = result.status; // 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted'
    const dur = ((result.duration || 0) / 1000).toFixed(2);
    const name = `${test.parent.project} > ${test.title}`;
    const errMsg = (result.error && result.error.message) ? result.error.message.split('\n')[0] : '';

    if (status === 'passed') log.pass(test.title, `${dur}s`);
    else if (status === 'failed' || status === 'timedOut') log.fail(test.title, `${dur}s — ${errMsg}`);
    else if (status === 'skipped') log.skip(test.title, errMsg || 'skipped');
    else log.info('TEST', `${status}: ${test.title}`);

    this.results.push({ name, status, dur, errMsg });
  }

  onEnd(result) {
    const summary = log.finalizeRun();
    log.info('RUN-END', `Status: ${result.status} | Duration: ${(result.duration/1000).toFixed(1)}s`);

    // Fill in HTML
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed' || r.status === 'timedOut').length;
    const skipped = this.results.filter(r => r.status === 'skipped').length;
    const total = this.results.length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

    this.html = this.html.replace(
      'Running...',
      `Run: ${log.getRunId()}\n` +
      `Total: ${total}  |  Passed: ${passed} (${passRate}%)  |  Failed: ${failed}  |  Skipped: ${skipped}\n` +
      `Duration: ${(result.duration/1000).toFixed(1)}s\n` +
      `Log: ${log.getRunLogPath()}`
    );

    const rows = this.results.map((r, i) => {
      const cls = (r.status === 'failed' || r.status === 'timedOut') ? 'fail'
        : r.status === 'skipped' ? 'skip' : 'pass';
      return `<tr class="${cls}"><td>${i+1}</td><td>${r.name}</td><td>${r.status}</td><td>${r.dur}s</td><td>${r.errMsg || ''}</td></tr>`;
    }).join('');
    this.html = this.html.replace('<tbody id="rows"></tbody>', `<tbody id="rows">${rows}</tbody>`);
    this.html += '</body></html>';

    try {
      fs.writeFileSync(this.htmlPath, this.html, 'utf8');
      log.info('REPORTER', `HTML report: ${this.htmlPath}`);
    } catch (e) {
      log.error('REPORTER', `failed to write HTML: ${e.message}`);
    }
  }

  onError(err) {
    log.error('REPORTER', err.message);
  }

  // onExit fires on every termination, including SIGTERM/timeout.
  onExit() {
    try {
      if (this.htmlPath && this.html && !fs.existsSync(this.htmlPath)) {
        fs.writeFileSync(this.htmlPath, this.html, 'utf8');
        log.warn('REPORTER', `onExit: wrote partial HTML report: ${this.htmlPath}`);
      }
    } catch (e) {
      log.error('REPORTER', `onExit write failed: ${e.message}`);
    }
  }
}

module.exports = IdeakicksReporter;
