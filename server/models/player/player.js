var hand = require("../hand/hand.js");
var enums = require("../../constants/consts.js");
var reqconsts = require("../../constants/requests.js");
var events = require("events");

class Player {
  constructor(name, credit, isCreator, socket) {
    this.name = name;
    this.credit = credit;
    this.hand = new hand.Hand();
    this.isActive = true;
    this.bet = enums.Action.Void;
    this.isCreator = isCreator;
    this.socket = socket;

    this.events = new events.EventEmitter();
    this.listenToEvents();
  }

  listenToEvents() {
    this.socket.on(reqconsts.Request.Bet_Response, bet => {
      this.events.emit(reqconsts.Request.Bet_Response, bet);
    });
  }

  addHoleCard(card) {
    this.hand.addCard(card);
  }

  send(eventName, message) {
    if (!message) message = "";
    this.socket.emit(eventName, message);
  }

  sum() {
    return { name: this.name, credit: this.credit };
  }

  getHoleCardsFormat() {
    return { name: this.name, cards: this.hand.getCards() };
  }
}

module.exports.Player = Player;
