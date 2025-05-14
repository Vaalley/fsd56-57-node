require('dotenv').config();
const readline = require('readline');

const NB_ROUNDS = parseInt(process.env.CHIFOUMI_ROUNDS) || 3;
const CHOICES = ['pierre', 'papier', 'ciseaux'];

const player1 = { name: 'Joueur 1', score: 0 };
const player2 = { name: 'Joueur 2', score: 0 };

function getRandomChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function playRound(round) {
  const choice1 = getRandomChoice();
  const choice2 = getRandomChoice();
  console.log(`\nManche ${round + 1} :`);
  console.log(`${player1.name} joue : ${choice1}`);
  console.log(`${player2.name} joue : ${choice2}`);

  if (choice1 === choice2) {
    console.log('Égalité !');
    return;
  }
  if (
    (choice1 === 'pierre' && choice2 === 'ciseaux') ||
    (choice1 === 'papier' && choice2 === 'pierre') ||
    (choice1 === 'ciseaux' && choice2 === 'papier')
  ) {
    console.log(`${player1.name} remporte la manche !`);
    player1.score++;
  } else {
    console.log(`${player2.name} remporte la manche !`);
    player2.score++;
  }
}

function showResult() {
  console.log('\nRésultat final :');
  console.log(`${player1.name} : ${player1.score} point(s)`);
  console.log(`${player2.name} : ${player2.score} point(s)`);
  if (player1.score > player2.score) {
    console.log(`Gagnant : ${player1.name} !`);
  } else if (player2.score > player1.score) {
    console.log(`Gagnant : ${player2.name} !`);
  } else {
    console.log('Match nul !');
  }
}

console.log('Bienvenue dans le jeu Chifoumi !\n');
console.log(`Nombre de manches : ${NB_ROUNDS}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let round = 0;
function next() {
  if (round < NB_ROUNDS) {
    playRound(round);
    round++;
    setTimeout(next, 200);
  } else {
    showResult();
    rl.close();
  }
}

next();
