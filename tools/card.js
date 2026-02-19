const cardValues = {
    "KING": "K",
    "QUEEN": "Q",
    "JACK": "J",
    "ACE": "A"
}

const cardNumberValues = {
    "ACE": 11,
    "A": 11,
    "KING": 10,
    "K": 10,
    "QUEEN": 10,
    "Q": 10,
    "JACK": 10,
    "J": 10,
}

const cardSymbols = {
    "SPADES": "♠️",
    "CLUBS": "♣️",
    "HEARTS": "♥️",
    "DIAMONDS": "♦️"
}

const cardAcronyms = {
    "As": "A",
    "10": "0",
    "Valet": "J",
    "Reine": "Q",
    "Roi": "K",
    "pique": "S",
    "trèfle": "C",
    "cœur": "H",
    "carreau": "D"
}

async function deckToValue(deck) {
    let total = 0;

    for (let i = 0; i < deck.length; i++) {
        const cardValue = deck[i].slice(0, -2);

        total += cardNumberValues[cardValue] ?? Number(cardValue);
    }

    return total;
}

module.exports = { cardValues, cardNumberValues, cardSymbols, cardAcronyms, deckToValue };