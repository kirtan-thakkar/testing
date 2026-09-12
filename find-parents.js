const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('modal.html'));
const h2 = $('h2').filter((i, el) => $(el).text().includes('New category'));
console.log('Heading:', h2.text());
let p = h2.parent();
while (p && p.length) {
  console.log(p.prop('tagName'), p.attr('class'), p.attr('role'));
  p = p.parent();
}
