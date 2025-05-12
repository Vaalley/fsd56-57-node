const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../Data/student.txt');

// 1. Lecture asynchrone du fichier JSON
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Erreur lors de la lecture asynchrone:', err.message);
    return;
  }
  try {
    const json = JSON.parse(data);
    console.log('Lecture asynchrone réussie. Exemple de données:\n', JSON.stringify(json.slice(0, 2), null, 2));
  } catch (e) {
    console.error('Erreur de parsing JSON (asynchrone):', e.message);
  }

  // 1bis. Lecture synchrone pour la suite
  try {
    const syncData = fs.readFileSync(filePath, 'utf8');
    const arr = JSON.parse(syncData);
    // 4. Création des objets student avec calcul de la moyenne
    const students = arr.map(obj => {
      const note = Array.isArray(obj.notes) ? obj.notes.reduce((a, b) => a + b, 0) / obj.notes.length : null;
      return { name: obj.name || null, note, address: obj.address || null };
    });
    // 2. Étudiants avec moyenne strictement > 17
    const above17 = students.filter(s => s.note > 17);
    // 3. Étudiant avec la meilleure note
    const best = students.reduce((acc, cur) => (cur.note > acc.note ? cur : acc), students[0]);
    // 5. Ordonner le tableau (décroissant)
    students.sort((a, b) => b.note - a.note);

    console.log('\nÉtudiants avec moyenne > 17:');
    console.table(above17);
    console.log('\nÉtudiant avec la meilleure moyenne:');
    console.table([best]);
    console.log('\nTous les étudiants (triés par moyenne décroissante):');
    console.table(students);
  } catch (e) {
    console.error('Erreur lors de la lecture ou du parsing synchrone:', e.message);
  }
});
