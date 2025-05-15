const http = require('http');
const path = require('path');
const fs = require('fs');
const pug = require('pug');
const querystring = require('querystring');

const PORT = 3000;
const viewsDir = __dirname;
const contactsPath = path.join(__dirname, 'contacts.json');

const menuItems = [
    { path: '/', title: 'Home' },
    { path: '/about-me', title: 'About' },
    { path: '/references', title: 'References' },
    { path: '/contact-me', title: 'Contact' },
];

function getMenu(activePath) {
    return menuItems.map(item => ({ ...item, isActive: item.path === activePath }));
}

function renderPug(res, template, options = {}) {
    try {
        const html = pug.renderFile(path.join(viewsDir, template), { ...options, pretty: true });
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Template error: ' + err.message);
    }
}

function handleHome(req, res, toast) {
    renderPug(res, 'index.pug', { menuItems: getMenu('/'), toast });
}
function handleAbout(req, res) {
    renderPug(res, 'about-me.pug', { menuItems: getMenu('/about-me') });
}
function handleContact(req, res) {
    renderPug(res, 'contact-me.pug', { menuItems: getMenu('/contact-me') });
}

function parseBody(req, callback) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
        callback(querystring.parse(body));
    });
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === 'GET') {
        if (url.pathname === '/') {
            handleHome(req, res, url.searchParams.get('toast'));
        } else if (url.pathname === '/about-me') {
            handleAbout(req, res);
        } else if (url.pathname === '/contact-me') {
            handleContact(req, res);
        } else if (url.pathname.startsWith('/public/')) {
            const filePath = path.join(__dirname, url.pathname);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404); res.end('Not found');
                } else {
                    res.writeHead(200); res.end(data);
                }
            });
        } else {
            res.writeHead(404); res.end('Not found');
        }
    } else if (req.method === 'POST' && url.pathname === '/contact') {
        parseBody(req, fields => {
            const { email, message } = fields;
            const contact = { email, message, date: new Date().toISOString() };
            let contacts = [];
            if (fs.existsSync(contactsPath)) {
                contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf-8'));
            }
            contacts.push(contact);
            fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2));
            // Redirection avec toast
            res.writeHead(302, { 'Location': '/?toast=' + encodeURIComponent('Votre demande de contact a bien été envoyée.') });
            res.end();
        });
    } else {
        res.writeHead(405); res.end('Method Not Allowed');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
