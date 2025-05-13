function calculerPrixTTC(priceHT, tva = 0.2) {
    return Number((priceHT * (1 + tva)).toFixed(2));
}

module.exports = { calculerPrixTTC };
