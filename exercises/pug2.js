const pug = require('pug');
const path = require('path');

const loggedUser = {
    name: {
        first: 'Jean',
        last: 'Dupont',
    },
    age: 36,
    birthdate: new Date('1986-04-18'),
    location: {
        zipcode: '77420',
        city: 'Champs-sur-Marne',
    },
    isAdmin: true
};

const templatePath = path.join(__dirname, 'user-card.pug');
const html = pug.renderFile(templatePath, {
    user: loggedUser,
    pretty: true
});

console.log(html);
