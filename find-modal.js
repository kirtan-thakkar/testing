const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('modal.html'));
const h2 = $('h2').filter((i, el) => $(el).text().includes('New category'));
console.log('Heading:', h2.text());
const wrapper = h2.closest('form');
console.log('Wrapper form:', wrapper.prop('tagName'), 'role:', wrapper.attr('role'));
const dialog = h2.closest('[role="dialog"]');
console.log('Wrapper dialog:', dialog.prop('tagName'), 'role:', dialog.attr('role'));
