/**
 * Run-level logger. Writes to BOTH:
 *   1. logs/test-execution.log  (append-only, all runs)
 *   2. logs/run-<timestamp>.log (this run only, for email)
 *
 * Also tracks pass/fail/skip counts in memory and emits a summary
 * when finalizeRun() is called.
 */
const fs = require('node:fs');
const path = require('node:path');

const LOG_DIR = path.join(process.cwd(), 'logs');
const ROLLING_LOG = path.join(LOG_DIR, 'test-execution.log');

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const runId = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
const runLog = path.join(LOG_DIR, `run-${runId}.log`);
// Keep "latest" symlink fresh (Windows: copy as file since symlinks need admin)
const latestLog = path.join(LOG_DIR, 'run-latest.log');
let latestContent = '';

const counts = { passed: 0, failed: 0, skipped: 0, info: 0, warn: 0, error: 0 };
const startedAt = Date.now();

const TS = () => new Date().toISOString().replace('T', ' ').replace('Z', '');

function format(level, scope, msg, extra) {
  const base = `${TS()} [${level.padEnd(5)}] ${scope} :: ${msg}`;
  if (extra !== undefined) {
    try {
      return `${base} | ${typeof extra === 'string' ? extra : JSON.stringify(extra)}`;
    } catch {
      return `${base} | <unserializable>`;
    }
  }
  return base;
}

function write(line) {
  // stdout for live monitoring
  // eslint-disable-next-line no-console
  console.log(line);
  // rolling log (append)
  try { fs.appendFileSync(ROLLING_LOG, line + '\n', 'utf8'); } catch {}
  // per-run log (in-memory + flush)
  latestContent += line + '\n';
  try { fs.appendFileSync(runLog, line + '\n', 'utf8'); } catch {}
  // keep "latest" symlink in sync
  try { fs.writeFileSync(latestLog, latestContent, 'utf8'); } catch {}
}

const log = {
  info: (scope, msg, extra) => { counts.info++; write(format('INFO', scope, msg, extra)); },
  warn: (scope, msg, extra) => { counts.warn++; write(format('WARN', scope, msg, extra)); },
  error: (scope, msg, extra) => { counts.error++; write(format('ERROR', scope, msg, extra)); },
  debug: (scope, msg, extra) => write(format('DEBUG', scope, msg, extra)),
  pass: (scope, msg) => { counts.passed++; write(format('PASS', scope, msg)); },
  fail: (scope, msg) => { counts.failed++; write(format('FAIL', scope, msg)); },
  skip: (scope, msg) => { counts.skipped++; write(format('SKIP', scope, msg)); },
  getCounts: () => ({ ...counts }),
  getRunLogPath: () => runLog,
  getRollingLogPath: () => ROLLING_LOG,
  getRunId: () => runId,
  getDurationMs: () => Date.now() - startedAt,
  finalizeRun: () => {
    const dur = ((Date.now() - startedAt) / 1000).toFixed(1);
    const total = counts.passed + counts.failed + counts.skipped;
    const passRate = total > 0 ? ((counts.passed / total) * 100).toFixed(1) : '0.0';
    const banner = '\n' + '='.repeat(72) + '\n'
      + `  TEST RUN SUMMARY — ${runId}\n`
      + '='.repeat(72);
    const lines = [
      banner,
      `  Total      : ${total}`,
      `  Passed     : ${counts.passed}  (${passRate}%)`,
      `  Failed     : ${counts.failed}`,
      `  Skipped    : ${counts.skipped}`,
      `  Info logs  : ${counts.info}`,
      `  Warnings   : ${counts.warn}`,
      `  Errors     : ${counts.error}`,
      `  Duration   : ${dur}s`,
      `  Run log    : ${runLog}`,
      `  Rolling log: ${ROLLING_LOG}`,
      '='.repeat(72),
      '',
    ];
    const summary = lines.join('\n');
    write('INFO  RUN-SUMMARY :: ' + summary.replace(/\n/g, ' | '));
    try { fs.appendFileSync(runLog, summary, 'utf8'); } catch {}
    try { fs.appendFileSync(latestLog, summary, 'utf8'); } catch {}
    return summary;
  },
};

module.exports = log;
