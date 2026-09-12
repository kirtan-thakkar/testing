const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('categories.html'));
const btn = $('button, a').filter((i, el) => $(el).text().toLowerCase().includes('new category'));
console.log('New category button:', btn.prop('tagName'), btn.attr('href'));
