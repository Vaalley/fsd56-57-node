const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, 'users.json');

// Valeur initiale si le fichier n'existe pas
defaultUsers = [
  { nom: "Alice", email: "alice.dupont@example.com", role: "admin" },
  { nom: "Jean", email: "jean.martin@example.com", role: "utilisateur" },
  { nom: "Sophie", email: "sophie.lambert@example.com", role: "modérateur" },
  { nom: "Lucas", email: "lucas.moreau@example.com", role: "utilisateur" },
  { nom: "Emma", email: "emma.lefevre@example.com", role: "admin" },
  { nom: "Hugo", email: "hugo.bernard@example.com", role: "utilisateur" },
  { nom: "Chloé", email: "chloe.richard@example.com", role: "modérateur" },
  { nom: "Thomas", email: "thomas.garcia@example.com", role: "utilisateur" },
  { nom: "Manon", email: "manon.petit@example.com", role: "admin" },
  { nom: "Nathan", email: "nathan.robert@example.com", role: "utilisateur" }
];

function ensureFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultUsers, null, 2), 'utf8');
  }
}

function readUsers() {
  ensureFile();
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data || '[]');
}

function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function getAllUsers() {
  return readUsers();
}

function getUserById(id) {
  const users = readUsers();
  return users[id];
}

function addUser(nom, email) {
  const users = readUsers();
  users.push({ nom, email, role: 'utilisateur' });
  writeUsers(users);
}

module.exports = { getAllUsers, getUserById, addUser };
