function holeCard(card) {
  return { operation: 1, holeCard: card };
}

function communityCards(cards) {
  return { operation: 25, holeCard: cards };
}

function requestBet() {
  return { operation: 3 };
}

function betUpdate(amount, name) {
  return { operation: 3, bet: amount, player: name };
}

function winner(name) {
  return { operation: 5, player: name };
}

function exposeCards(players, cards) {}
