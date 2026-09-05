#!/usr/bin/env bash
# Daily IdeaKicks test run + email report.
# Cron example: 0 19 * * * /usr/local/bin/run-daily-tests.sh
set -e
cd /c/ideakicks/testing
export PATH="$PATH:/c/Program Files/nodejs"

echo "=== IdeaKicks nightly test run starting at $(date) ==="
npx playwright test --project=chromium --reporter=list --workers=1 2>&1 | tee logs/cron-output.log

echo "=== Sending email report ==="
node tests/send-report-email.js

echo "=== Done at $(date) ==="
