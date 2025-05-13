// Module métier pour calculer le prix TTC

/**
 * Calcule le prix TTC à partir du prix HT et d'un taux de TVA
 * @param {number} priceHT - Prix hors taxe
 * @param {number} tva - Taux de TVA (ex: 0.2 pour 20%)
 * @returns {number} Prix TTC arrondi à 2 décimales
 */
function calculerPrixTTC(priceHT, tva = 0.2) {
    return Number((priceHT * (1 + tva)).toFixed(2));
}

module.exports = { calculerPrixTTC };
