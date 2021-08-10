var card = require("./card.js");
var list = require("./linkedlist.js");
var enums = require("./../../constants/consts.js");

class Deck {
  constructor() {
    this.cards = new list.LinkedList();
  }

  initialize() {
    this.cards = new list.LinkedList();
    for (let i = 0; i < 4; i++) {
      let color = enums.Color.Red;
      if (i % 2 == 0) color = enums.Color.Black;
      let suit = i;

      for (let j = 0, cardNumber = 2; j < 13; j++, cardNumber++)
        this.cards.add(new card.Card(cardNumber, suit, color));
    }
    this.shuffle();
  }

  shuffle(times = 1) {
    for (let i = 0; i < times; i++) {
      var newDeck = new list.LinkedList();
      while (this.cards.size > 0) {
        let randCard = Math.floor(Math.random() * Math.floor(this.cards.size));
        let removedCard = this.cards.removePerIndex(randCard).element;
        if (removedCard) newDeck.add(removedCard);
      }
      this.cards = newDeck;
    }
  }

  draw() {
    let node = this.cards.remove();
    return node.element;
  }

  burnTop() {
    this.draw();
  }

  isEmpty() {
    return this.cards.size == 0;
  }

  print() {
    let node = this.cards.head;
    while (node != null) {
      console.log(node.element);
      node = node.next;
    }
  }
}

module.exports.Deck = Deck;
