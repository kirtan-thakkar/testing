const xlsx = require('xlsx');
const workbook = xlsx.readFile('deepshika.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

console.log('Total Rows:', data.length);
for(let i=0; i<data.length; i++) {
  const row = data[i];
  const id = row['Test Case ID'];
  if (id) {
    console.log(`\nID: ${id}`);
    console.log(`Title: ${row['Test Case Title']}`);
    console.log(`Steps: ${row['Steps to Execute']?.replace(/\n/g, ' ')}`);
    console.log(`Expected: ${row['Expected Result']?.replace(/\n/g, ' ')}`);
    console.log(`Status: ${row['Status']}`);
  }
}
