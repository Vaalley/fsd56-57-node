const pug = require('pug');
const path = require('path');

const template = path.join(__dirname, 'admin-message.pug');

console.log('Rendu avec isAdmin: true');
console.log(pug.renderFile(template, { user: { isAdmin: true } }));

console.log('\nRendu avec isAdmin: false');
console.log(pug.renderFile(template, { user: { isAdmin: false } }));
