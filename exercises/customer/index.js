// Import de la fonction métier
const { calculerPrixTTC } = require('./utils');

const priceHT = [
    { name : "Apple", priceHT : 1.0, priceTTC : null },
    { name : "Orange", priceHT : 1.2, priceTTC : null },
    { name : "Rasberry", priceHT : 2.5, priceTTC : null },
];

// Ajout du prix TTC à chaque élément
priceHT.forEach(item => {
    item.priceTTC = calculerPrixTTC(item.priceHT);
});

console.log(priceHT);
