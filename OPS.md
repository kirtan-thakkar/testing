# IdeaKicks Test Automation — Operations

## Layout

- `tests/*.spec.js` — functional + admin + wizard + performance tests
- `tests/logger.js` — per-run + rolling log file (`logs/run-<id>.log`, `logs/test-execution.log`)
- `tests/reporter.js` — Playwright custom reporter; logs pass/fail/skip, writes `logs/run-<id>.html`
- `tests/send-report-email.js` — SMTP email of latest report (uses `nodemailer`)
- `run-daily-tests.sh` — cron wrapper that runs tests then emails the report
- `logs/run-latest.log` — symlink-style "most recent run" log

## Run

```
# One-off:
npx playwright test --project=chromium --reporter=list --workers=1

# Just the performance/stress suite:
npx playwright test tests/performance.spec.js

# Daily cron (Linux):
0 19 * * * /c/ideakicks/testing/run-daily-tests.sh
```

## Email config (`.env`)

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=app-password
MAIL_FROM=you@gmail.com
MAIL_TO=mentor@example.com
```

## Logs

- Rolling: `logs/test-execution.log` (append-only, all runs)
- Per-run: `logs/run-YYYY-MM-DD_HH-MM-SS.log`
- HTML report: `logs/run-YYYY-MM-DD_HH-MM-SS.html`
