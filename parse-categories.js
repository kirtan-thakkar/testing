const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('categories.html'));
$('input').each((i, el) => console.log('Input:', $(el).attr('placeholder'), $(el).attr('type')));
$('h1, h2, h3').each((i, el) => console.log('Heading:', $(el).text().trim()));
$('table tr').each((i, el) => console.log('Row:', $(el).text().replace(/\s+/g, ' ').substring(0, 100)));
