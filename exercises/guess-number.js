const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const MAX_ATTEMPTS = 10;
const MIN = 1;
const MAX = 100;
const hiddenNumber = Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
let attempts = 0;

console.log('Bienvenue au jeu de devinette !');
console.log(`Devinez un nombre entre ${MIN} et ${MAX}. Vous avez ${MAX_ATTEMPTS} tentatives.`);

function ask() {
  rl.question(`Tentative ${attempts + 1}/${MAX_ATTEMPTS} : Quel est votre nombre ? `, (answer) => {
    const guess = Number(answer.trim());
    if (Number.isNaN(guess) || guess < MIN || guess > MAX) {
      console.log(`Entrée invalide. Veuillez entrer un nombre entre ${MIN} et ${MAX}.`);
      ask();
      return;
    }
    attempts++;
    if (guess === hiddenNumber) {
      console.log(`Bravo ! Vous avez trouvé le nombre caché (${hiddenNumber}) en ${attempts} tentative(s).`);
      rl.close();
    } else if (attempts >= MAX_ATTEMPTS) {
      console.log(`Désolé, vous avez épuisé vos ${MAX_ATTEMPTS} tentatives. Le nombre était ${hiddenNumber}.`);
      rl.close();
    } else if (guess < hiddenNumber) {
      console.log('C\'est plus grand !');
      ask();
    } else {
      console.log('C\'est plus petit !');
      ask();
    }
  });
}

ask();
