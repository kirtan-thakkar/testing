const fs = require('fs');
const html = fs.readFileSync('step3.html', 'utf8');
const cheerio = require('cheerio');
const $ = cheerio.load(html);
const stepTitle = $('h1').text().trim();
const inputs = [];
$('input, textarea, select, button').each((i, el) => {
  const t = $(el).prop('tagName');
  const type = $(el).attr('type') || '';
  const id = $(el).attr('id') || '';
  let label = $('label[for="' + id + '"]').text().trim();
  if (!label && id) {
     label = $(el).closest('div').find('label').text().trim();
  }
  if (!label) label = $(el).text().trim();
  if (!label) label = $(el).attr('placeholder');
  inputs.push(t + (type ? '['+type+']' : '') + ' id=' + id + ' label="' + label + '"');
});
console.log('Title:', stepTitle);
console.log('Inputs:', inputs.join('\n'));
