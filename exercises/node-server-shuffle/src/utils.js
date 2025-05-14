const users = [
    'Alan',
    'Sophie',
    'Bernard',
    'Elie'
];

function shuffle(array) {
    // Algorithme de Fisher-Yates
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = { users, shuffle };