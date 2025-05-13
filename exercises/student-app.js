const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, '..', 'data', 'student.json');

function loadStudents() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.error('Erreur de lecture ou parsing du fichier student.json:', e.message);
    process.exit(1);
  }
}

function moyenne(notes) {
  if (!Array.isArray(notes) || notes.length === 0) return null;
  return notes.reduce((a, b) => a + b, 0) / notes.length;
}

function showHelp() {
  console.log('\nCommandes disponibles :');
  console.log('  list                Affiche la liste des noms d\'élèves.');
  console.log('  find <nom>          Affiche les infos d\'un élève.');
  console.log('  more <note>         Affiche les élèves avec une moyenne > note.');
  console.log('  help                Affiche cette aide.');
  console.log('  exit                Quitte le programme.');
}

function saveStudents(students) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2), 'utf8');
  } catch (e) {
    console.error('Erreur lors de la sauvegarde du fichier student.json:', e.message);
  }
}

function handleCommand(input, rl) {
  const students = loadStudents();
  const args = input.trim().split(/\s+/);
  const cmd = args[0]?.toLowerCase();
  if (!cmd) return;
  switch (cmd) {
    case 'list':
      console.log('\nListe des élèves :');
      students.forEach(s => console.log('- ' + s.name));
      break;
    case 'find':
      if (!args[1]) {
        console.log('Veuillez préciser un nom.');
        break;
      }
      const nom = args.slice(1).join(' ').toUpperCase();
      const found = students.find(s => s.name.toUpperCase() === nom);
      if (found) {
        console.log('\nInformations sur ' + found.name + ' :');
        console.table({
          Nom: found.name,
          Adresse: found.address,
          Notes: found.notes.join(', '),
          Moyenne: moyenne(found.notes)
        });
      } else {
        console.log('Aucun élève trouvé avec ce nom.');
      }
      break;
    case 'more':
      if (!args[1] || isNaN(Number(args[1]))) {
        console.log('Veuillez préciser une valeur numérique pour la moyenne.');
        break;
      }
      const min = Number(args[1]);
      const filtered = students.filter(s => moyenne(s.notes) > min);
      if (filtered.length === 0) {
        console.log('Aucun élève avec une moyenne supérieure à', min);
      } else {
        console.log(`\nÉlèves avec une moyenne > ${min} :`);
        filtered.forEach(s => {
          console.log(`- ${s.name} (Moyenne : ${moyenne(s.notes)})`);
        });
      }
      break;
    case 'addnote':
      rl.question('Nom de l\'élève : ', (nomSaisi) => {
        const studentsList = loadStudents();
        const idx = studentsList.findIndex(s => s.name.toUpperCase() === nomSaisi.trim().toUpperCase());
        if (idx === -1) {
          console.log('Aucun élève trouvé avec ce nom.');
          rl.prompt();
        } else {
          rl.question('Note à ajouter : ', (noteSaisie) => {
            const note = Number(noteSaisie);
            if (isNaN(note)) {
              console.log('Veuillez entrer une note numérique.');
            } else {
              studentsList[idx].notes.push(note);
              saveStudents(studentsList);
              console.log(`Note ${note} ajoutée à ${studentsList[idx].name}.`);
            }
            rl.prompt();
          });
        }
      });
      break;
    case 'help':
      showHelp();
      break;
    case 'exit':
      console.log('Au revoir !');
      process.exit(0);
    default:
      console.log('Commande inconnue. Tapez help pour la liste des commandes.');
  }
}

console.log('Bienvenue dans le système de gestion des élèves !');
showHelp();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

rl.prompt();
rl.on('line', (input) => {
  handleCommand(input, rl);
  rl.prompt();
});

rl.on('close', () => {
  console.log('Au revoir !');
  process.exit(0);
});