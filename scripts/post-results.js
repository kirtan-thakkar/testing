const fs = require('fs');
const path = require('path');

const WEBHOOK_URL = process.env.GOOGLE_WEBHOOK_URL;

async function main() {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    console.log('[PostResults] No logs directory found.');
    return;
  }

  const runLogs = fs.readdirSync(logsDir)
    .filter(f => f.startsWith('run-') && f.endsWith('.html'))
    .map(f => ({ f, t: fs.statSync(path.join(logsDir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);

  if (runLogs.length === 0) {
    console.log('[PostResults] No HTML logs found to process.');
    return;
  }

  const latestHtmlFile = runLogs[0].f;
  const htmlContent = fs.readFileSync(path.join(logsDir, latestHtmlFile), 'utf8');
  
  const rowRegex = /<tr class="(pass|fail|skip)"><td>\d+<\/td><td>([^<]+)<\/td><td>([^<]+)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><\/tr>/g;
  
  let match;
  const payloadData = [];
  const csvRows = [];
  
  // CSV Header
  csvRows.push(['Test ID', 'Status', 'Duration (s)', 'Error Message'].join(','));
  
  const todayStr = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());

  while ((match = rowRegex.exec(htmlContent)) !== null) {
    const rawClass = match[1];
    const testName = match[2];
    const dur = match[4].replace('s', '');
    let errMsg = match[5] || '';
    
    let status = 'FAIL';
    if (rawClass === 'pass') status = 'PASS';
    else if (rawClass === 'skip') status = 'SKIPPED';

    let testId = testName;
    const idMatch = testName.match(/([A-Z]+-[A-Z]+-[A-Z0-9]+-\d+|FUNC|CAT-ACC-\d+|UF-[A-Z]+-\d+-[PN])/);
    if (idMatch) {
      testId = idMatch[1];
    }
    
    // Custom Error Reasons for skips/timeouts
    if (status === 'SKIPPED' && !errMsg) {
      if (testId.includes('UF-WIZ')) errMsg = 'Skipped: Account locked or previous wizard step failed';
      else errMsg = 'Skipped due to previous failure in serial suite';
    }
    
    if (status === 'FAIL' && errMsg.includes('TimeoutError')) {
       if (testId.includes('UF-WIZ')) errMsg = 'Timeout: Form already submitted / Account locked';
    }
    
    payloadData.push({
      id: testId,
      status: status,
      duration: dur
    });
    
    // Add to CSV (wrap strings in quotes to handle commas)
    csvRows.push([`"${testId}"`, `"${status}"`, `"${dur}"`, `"${errMsg.replace(/"/g, '""')}"`].join(','));
  }

  console.log(`[PostResults] Parsed ${payloadData.length} test results.`);

  // 1A. Generate the Daily CSV
  const dailyCsvPath = path.join(logsDir, `daily-report.csv`);
  fs.writeFileSync(dailyCsvPath, csvRows.join('\n'), 'utf8');
  console.log(`[PostResults] Saved Daily CSV to ${dailyCsvPath}`);

  // 1B. Maintain the Global CSV
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
  const globalCsvPath = path.join(reportsDir, 'global-report.csv');
  
  let globalHeaders = ['Test ID'];
  let globalData = {}; // { 'UF-WIZ-01': ['PASS', 'FAIL'] }
  
  if (fs.existsSync(globalCsvPath)) {
    const lines = fs.readFileSync(globalCsvPath, 'utf8').trim().split('\n');
    if (lines.length > 0) {
      // Use a basic regex to split by comma, ignoring commas inside quotes if any exist
      globalHeaders = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.replace(/^"|"$/g, ''));
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, ''));
        if (row.length > 0) {
          globalData[row[0]] = row.slice(1);
        }
      }
    }
  }

  // Add today's column if it doesn't exist
  if (!globalHeaders.includes(todayStr)) {
    globalHeaders.push(todayStr);
  }
  const todayColIndex = globalHeaders.indexOf(todayStr) - 1; // -1 because Test ID is index 0

  // Update data with today's results
  payloadData.forEach(res => {
    if (!globalData[res.id]) {
      // New test case, fill previous columns with '-'
      globalData[res.id] = new Array(globalHeaders.length - 1).fill('-');
    }
    // Ensure array is long enough
    while (globalData[res.id].length <= todayColIndex) {
      globalData[res.id].push('-');
    }
    globalData[res.id][todayColIndex] = res.status;
  });

  // Rebuild Global CSV
  const globalCsvRows = [globalHeaders.map(h => `"${h}"`).join(',')];
  for (const [testId, statuses] of Object.entries(globalData)) {
    // Ensure array is padded if some tests didn't run today
    while (statuses.length < globalHeaders.length - 1) statuses.push('-');
    globalCsvRows.push([`"${testId}"`, ...statuses.map(s => `"${s}"`)].join(','));
  }
  
  fs.writeFileSync(globalCsvPath, globalCsvRows.join('\n'), 'utf8');
  console.log(`[PostResults] Updated Global CSV at ${globalCsvPath}`);

  // 2. Post to Google Webhook
  if (WEBHOOK_URL) {
    console.log('[PostResults] Sending data to Google Webhook...');
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayStr,
          results: payloadData
        })
      });
      const resultText = await response.text();
      console.log(`[PostResults] Webhook response:`, resultText);
    } catch (err) {
      console.error(`[PostResults] Failed to post to webhook:`, err.message);
    }
  } else {
    console.log('[PostResults] GOOGLE_WEBHOOK_URL is not set. Skipping push to Google Sheets.');
  }
}

main().catch(console.error);
