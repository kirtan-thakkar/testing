/**
 * Compact logger for the IdeaKicks test suite.
 *
 * Output goes to:
 *   - logs/test-execution.log  (rolling, append-only, all runs)
 *   - logs/run-<id>.log        (per-run, this run only — for email)
 *   - console                  (live monitoring)
 *
 * Each line is:  HH:MM:SS.mmm [LEVEL ] scope :: message
 * Compact format keeps each line under ~100 chars for easy grep.
 */
const fs = require('node:fs');
const path = require('node:path');

const LOG_DIR = path.join(process.cwd(), 'logs');
const ROLLING_LOG = path.join(LOG_DIR, 'test-execution.log');

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const runId = process.env.PLAYWRIGHT_RUN_ID || new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
if (!process.env.PLAYWRIGHT_RUN_ID) process.env.PLAYWRIGHT_RUN_ID = runId;
const runLog = path.join(LOG_DIR, `run-${runId}.log`);
const LATEST_LOG = path.join(LOG_DIR, 'run-latest.log');

const counts = { passed: 0, failed: 0, skipped: 0 };

const TS = () => new Date().toISOString().replace('T', ' ').replace('Z', '').slice(11, 23);

function format(level, scope, msg) {
  return `${TS()} [${level}] ${scope.padEnd(12)} ${msg}`;
}

function write(line) {
  // console
  // eslint-disable-next-line no-console
  console.log(line);
  // rolling
  try { fs.appendFileSync(ROLLING_LOG, line + '\n', 'utf8'); } catch {}
  // per-run
  try { fs.appendFileSync(runLog, line + '\n', 'utf8'); } catch {}
  // latest run mirror
  try { fs.appendFileSync(LATEST_LOG, line + '\n', 'utf8'); } catch {}
}

const log = {
  info:  (scope, msg) => write(format('INFO',  scope, msg)),
  warn:  (scope, msg) => write(format('WARN',  scope, msg)),
  error: (scope, msg) => write(format('ERROR', scope, msg)),
  pass:  (scope, msg) => { counts.passed++;  write(format('PASS', scope, msg)); },
  fail:  (scope, msg) => { counts.failed++;  write(format('FAIL', scope, msg)); },
  skip:  (scope, msg) => { counts.skipped++; write(format('SKIP', scope, msg)); },
  getCounts:    () => ({ ...counts }),
  getRunLogPath:    () => runLog,
  getRollingLogPath: () => ROLLING_LOG,
  getRunId:    () => runId,
  getRunStart: () => startedAt,
  finalizeRun: () => {
    const dur = ((Date.now() - startedAt) / 1000).toFixed(1);
    const total = counts.passed + counts.failed + counts.skipped;
    const passRate = total > 0 ? ((counts.passed / total) * 100).toFixed(1) : '0.0';
    const summary = [
      '',
      '='.repeat(72),
      `  RUN SUMMARY  ${runId}`,
      '='.repeat(72),
      `  Total    : ${total}`,
      `  Passed   : ${counts.passed}  (${passRate}%)`,
      `  Failed   : ${counts.failed}`,
      `  Skipped  : ${counts.skipped}`,
      `  Duration : ${dur}s`,
      `  Log      : ${runLog}`,
      '='.repeat(72),
      '',
    ].join('\n');
    try { fs.appendFileSync(runLog, summary, 'utf8'); } catch {}
    try { fs.appendFileSync(ROLLING_LOG, summary, 'utf8'); } catch {}
    try { fs.appendFileSync(LATEST_LOG, summary, 'utf8'); } catch {}
    return summary;
  },
};

const startedAt = Date.now();
module.exports = log;
