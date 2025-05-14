const http = require('http');
const { users, shuffle } = require('./utils');

function renderUserList(userList) {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des utilisateurs</title>
</head>
<body>
    <h1>Utilisateurs</h1>
    <ul>
        ${userList.map(user => `<li>${user}</li>`).join('')}
    </ul>
    <a href="/shuffle">Mélanger</a>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderUserList(users));
    } else if (req.url === '/shuffle') {
        shuffle(users);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderUserList(users));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});