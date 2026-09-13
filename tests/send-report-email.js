#!/usr/bin/env node
/**
 * Sends an email with the latest test-run log + HTML report.
 * Usage:  node tests/send-report-email.js
 *
 * Configure in .env (or env vars):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, MAIL_TO
 */
const fs = require('node:fs');
const path = require('node:path');

// Try to load .env if present
try { require('dotenv').config(); } catch {}

const log = require('./logger.js');

async function main() {
  const {
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS,
    MAIL_FROM, MAIL_TO,
  } = process.env;

  if (!SMTP_HOST || !MAIL_TO) {
    console.error('[email] SMTP_HOST and MAIL_TO must be set. Aborting.');
    process.exit(1);
  }

  // Pick the most recent run log + html
  const logsDir = path.join(process.cwd(), 'logs');
  const runLogs = fs.readdirSync(logsDir)
    .filter(f => f.startsWith('run-') && f.endsWith('.log'))
    .map(f => ({ f, t: fs.statSync(path.join(logsDir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);

  if (runLogs.length === 0) {
    console.error('[email] no run logs found in', logsDir);
    process.exit(1);
  }
  const latestLogPath = path.join(logsDir, runLogs[0].f);
  const runId = runLogs[0].f.replace(/^run-/, '').replace(/\.log$/, '');
  const htmlPath = path.join(logsDir, `run-${runId}.html`);

  // Parse the summary block from the log
  const content = fs.readFileSync(latestLogPath, 'utf8');
  const totalMatch = content.match(/Total\s+:\s+(\d+)/);
  const passedMatch = content.match(/Passed\s+:\s+(\d+)/);
  const failedMatch = content.match(/Failed\s+:\s+(\d+)/);
  const skippedMatch = content.match(/Skipped\s+:\s+(\d+)/);
  const durMatch = content.match(/Duration\s+:\s+([\d.]+)s/);
  const passed = passedMatch ? +passedMatch[1] : 0;
  const failed = failedMatch ? +failedMatch[1] : 0;
  const total = totalMatch ? +totalMatch[1] : 0;
  const skipped = skippedMatch ? +skippedMatch[1] : 0;
  const dur = durMatch ? durMatch[1] : '?';
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

  // Extract failed tests from HTML if available
  let failedTestsList = '';
  if (fs.existsSync(htmlPath)) {
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    const rowRegex = /<tr class="fail"><td>\d+<\/td><td>([^<]+)<\/td><td>fail<\/td><td>[^<]*<\/td><td>([^<]*)<\/td><\/tr>/g;
    let match;
    while ((match = rowRegex.exec(htmlContent)) !== null) {
      failedTestsList += `- ${match[1]} (Error: ${match[2]})\n`;
    }
  }

  const githubLink = process.env.GITHUB_RUN_ID 
    ? `\nGitHub Actions Run: ${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}\n`
    : '';

  const subject = `[IdeaKicks Tests] ${passed}/${total} pass (${passRate}%) — ${failed} failed — ${new Date().toISOString().split('T')[0]}`;
  const textBody = `IdeaKicks Daily Automation Report: ${runId}\n\n` +
    `Date: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}\n` +
    `Total Tests: ${total}\nPassed: ${passed}\nFailed: ${failed}\nSkipped: ${skipped}\nPass Rate: ${passRate}%\nDuration: ${dur}s\n` +
    githubLink +
    (failedTestsList ? `\nFailed Tests:\n${failedTestsList}\n` : '\nAll tests passed successfully!\n') +
    `\nFull log: ${latestLogPath}\n` +
    (fs.existsSync(htmlPath) ? `HTML report attached: ${htmlPath}\n` : '');

  // Send via nodemailer if available
  let nodemailer;
  try { nodemailer = require('nodemailer'); }
  catch {
    console.error('[email] nodemailer not installed. Run: npm i nodemailer');
    console.error('[email] would have sent:');
    console.error('  To:', MAIL_TO);
    console.error('  Subject:', subject);
    console.error('  Body:\n' + textBody);
    process.exit(2);
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: +(SMTP_PORT || 587),
    secure: (SMTP_PORT === '465'),
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });

  const attachments = [
    { filename: path.basename(latestLogPath), path: latestLogPath },
  ];
  if (fs.existsSync(htmlPath)) {
    attachments.push({ filename: path.basename(htmlPath), path: htmlPath });
  }

  await transporter.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to: MAIL_TO,
    subject,
    text: textBody,
    html: fs.existsSync(htmlPath)
      ? fs.readFileSync(htmlPath, 'utf8')
      : `<pre>${textBody}</pre>`,
    attachments,
  });

  console.log(`[email] sent to ${MAIL_TO} — ${subject}`);
}

main().catch(e => { console.error('[email] error:', e); process.exit(1); });
