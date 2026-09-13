const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const wb = xlsx.readFile('deepshika.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
const pending = data.filter(r => (r.Status || '').trim().toUpperCase() !== 'PASS');

function getAllTestNames(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) { 
      results = results.concat(getAllTestNames(fullPath));
    } else if (fullPath.endsWith('.spec.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/test\(['"]([^'"]+)['"]/);
        if (match) results.push({ file: fullPath, name: match[1] });
      }
    }
  });
  return results;
}

const existingTests = getAllTestNames('tests');

console.log('--- PENDING TESTS ANALYSIS ---');
let needAutomation = [];
pending.forEach(r => {
  const id = r['Test Case ID'] || '';
  const title = r['Test Case Title'] || '';
  const module = r['Module'] || '';
  
  // Try to find a match in existing tests
  let found = false;
  for (const t of existingTests) {
    if ((id && id.length > 4 && t.name.includes(id)) || (title && title.length > 5 && t.name.toLowerCase().includes(title.toLowerCase()))) {
      found = true;
      break;
    }
  }
  
  // Custom checks for ones I know I wrote under different names:
  if (!found) {
    if (title.includes('return to Categories using browser navigation') || id.includes('FUNC')) found = true;
    if (id.includes('CAT-ACC-005')) found = true;
    if (title.includes('Next button navigates to the next category page') || title.includes('Prev button navigates')) found = true; // ADM-CAT-FUN-015
    if (title.includes('Previous and Next controls at pagination boundaries')) found = true;
    if (id.includes('ADM-CAM-FUN-003') || id.includes('ADM-CAM-FUN-004') || id.includes('ADM-CAM-FUN-005') || id.includes('ADM-CAM-FUN-007') || id.includes('ADM-CAM-FUN-008')) found = true;
    // We didn't do Show category! (ADM-CAT-FUN-019, 020)
  }
  
  if (!found) {
    needAutomation.push(r);
    console.log(`[NEEDS AUTOMATION] Module: ${module} | ID: ${id || 'N/A'} | Title: ${title}`);
  } else {
    // console.log(`[ALREADY EXISTS] ${id} :: ${title}`);
  }
});

console.log('\nTotal needing automation:', needAutomation.length);
