const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('modal.html'));
console.log('Name required?', $('#category-name').attr('required'));
console.log('Slug required?', $('label:contains("Slug")').next('input').attr('required'));
