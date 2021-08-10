const Suit = { Invalid: -1, Spade: 0, Heart: 1, Diamond: 2, Club: 3 };
const Color = { Black: 0, Red: 1 };

class Card {
  constructor(number, suit, color) {
    this.number = number;
    this.suit = suit;
    this.color = color;
  }

  compare(card) {
    if (this.number > card.number) return 1;
    else if (this.number < card.number) return -1;
    else {
      if (this.suit > card.suit) return 1;
      else if (this.suit < card.suit) return -1;
      else return 0;
    }
  }

  image() {
    return "";
  }

  serialize() {
    return { number: this.number, suit: this.suit, color: this.color };
  }
}

module.exports.Card = Card;
