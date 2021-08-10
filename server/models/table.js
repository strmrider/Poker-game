var playerModule = require("./player.js");
var deckModule = require("./deck.js");
var constants = require("../constants/consts.js");

class Table {
  constructor() {
    this.deck = deckModule.Deck();
    this.communityCards = new Array();
    this.jackpot = 0;
  }
}
