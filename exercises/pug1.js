const pug = require('pug');
const path = require('path');

function renderFile(templatePath, data) {
  return pug.renderFile(templatePath, data);
}

const template = path.join(__dirname, 'admin-message.pug');

console.log('Rendu avec isAdmin: true');
console.log(renderFile(template, { user: { isAdmin: true } }));

console.log('\nRendu avec isAdmin: false');
console.log(renderFile(template, { user: { isAdmin: false } }));
