require('dotenv').config();
const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { getAllUsers, getUserById, addUser } = require('./users');

const PORT = process.env.PORT || 3000;

function renderHomePage() {
  const users = getAllUsers();
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Accueil</title></head>
<body>
  <h1>Liste des utilisateurs</h1>
  <ul>
    ${users.map((u, i) => `<li><a href="/user/${i}">${u.nom}</a></li>`).join('')}
  </ul>
  <a href="/form">Ajouter un utilisateur</a>
</body>
</html>`;
}

function renderUserDetailPage(id) {
  const user = getUserById(id);
  if (!user) {
    return `<!DOCTYPE html><html><body><h1>Utilisateur non trouvé</h1><a href="/">Retour</a></body></html>`;
  }
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Détail utilisateur</title></head>
<body>
  <h1>Détail utilisateur</h1>
  <ul>
    <li>Nom : ${user.nom}</li>
    <li>Email : ${user.email}</li>
    <li>Role : ${user.role}</li>
  </ul>
  <a href="/">Retour à l'accueil</a>
</body>
</html>`;
}

function renderFormPage() {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Ajouter utilisateur</title></head>
<body>
  <h1>Ajouter un utilisateur</h1>
  <form method="POST" action="/form">
    <label>Nom : <input type="text" name="nom" required></label><br>
    <label>Email : <input type="email" name="email" required></label><br>
    <button type="submit">Ajouter</button>
  </form>
  <a href="/">Retour à l'accueil</a>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (req.method === 'GET' && parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderHomePage());
  } else if (req.method === 'GET' && parsedUrl.pathname === '/form') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderFormPage());
  } else if (req.method === 'POST' && parsedUrl.pathname === '/form') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const params = querystring.parse(body);
      if (params.nom && params.email) {
        addUser(params.nom, params.email);
        res.writeHead(302, { Location: '/' });
        res.end();
      } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Champs manquants');
      }
    });
  } else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/user/')) {
    const id = parsedUrl.pathname.split('/')[2];
    const user = getUserById(id);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Utilisateur non trouvé');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderUserDetailPage(id));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});