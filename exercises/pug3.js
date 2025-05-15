const pug = require('pug');
const path = require('path');

const menuItems = [
    { path: '/', title: 'Home', isActive: true },
    { path: '/about-me', title: 'About', isActive: false },
    { path: '/references', title: 'References', isActive: false },
    { path: '/contact-me', title: 'Contact', isActive: false },
];

const templatePath = path.join(__dirname, 'index.pug');
const html = pug.renderFile(templatePath, {
    menuItems,
    pretty: true
});

console.log(html);
