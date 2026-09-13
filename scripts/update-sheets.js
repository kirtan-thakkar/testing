const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

try { require('dotenv').config(); } catch {}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_CREDENTIALS = process.env.GOOGLE_CREDENTIALS; 

async function main() {
  if (!SPREADSHEET_ID || !GOOGLE_CREDENTIALS) {
    console.error('[Sheets] Missing credentials.');
    return;
  }

  const logsDir = path.join(process.cwd(), 'logs');
  const runLogs = fs.readdirSync(logsDir)
    .filter(f => f.startsWith('run-') && f.endsWith('.html'))
    .map(f => ({ f, t: fs.statSync(path.join(logsDir, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);

  if (runLogs.length === 0) return;

  const htmlContent = fs.readFileSync(path.join(logsDir, runLogs[0].f), 'utf8');
  const results = {};
  const rowRegex = /<tr class="(pass|fail|skip)"><td>\d+<\/td><td>([^<]+)<\/td>/g;
  let match;
  while ((match = rowRegex.exec(htmlContent)) !== null) {
    const idMatch = match[2].match(/([A-Z]+-[A-Z]+-[A-Z0-9]+-\d+|FUNC|CAT-ACC-\d+)/);
    if (idMatch) {
      results[idMatch[1]] = match[1] === 'pass' ? 'PASS' : (match[1] === 'skip' ? 'SKIPPED' : 'FAIL');
    }
  }

  console.log('[Sheets] Found results for', Object.keys(results).length, 'test cases.');

  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(GOOGLE_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  
  const sheets = google.sheets({ version: 'v4', auth });
  const todayStr = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short' }).format(new Date());
  const sheetName = 'Automation Result';

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: \`\${sheetName}!A1:Z\`
  });

  const rows = res.data.values || [];
  if (rows.length === 0) return;

  const headers = rows[0];
  let colIndex = headers.indexOf(todayStr);

  if (colIndex === -1) {
    colIndex = headers.length;
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: \`\${sheetName}!\${getColumnLetter(colIndex)}1\`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[todayStr]] }
    });
  }

  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const rowId = rows[i][0];
    if (rowId && results[rowId]) {
      data.push({
        range: \`\${sheetName}!\${getColumnLetter(colIndex)}\${i + 1}\`,
        values: [[results[rowId]]]
      });
    }
  }

  if (data.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: data
      }
    });
    console.log('[Sheets] Updated', data.length, 'rows.');
  }
}

function getColumnLetter(index) {
  let letter = '';
  let temp = index;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

main().catch(console.error);
