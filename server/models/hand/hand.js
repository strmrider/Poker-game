var handCal = require("./cals.js");
var enums = require("../../constants/consts.js");

class Hand {
  constructor(holecards = null) {
    this.rank = enums.Ranks.None;
    if (holecards) this.holecards = holecards;
    else this.holecards = new Array();
  }

  computeRank(communityCards) {
    this.rank = handCal.computeHand(this.holecards, communityCards);
    return this.rank;
  }

  addCard(card) {
    this.holecards.push(card);
  }

  compareTo(secondHand) {
    return this.rank.compareTo(secondHand.rank);
  }

  getCards() {
    return this.holecards;
  }
}

module.exports.Hand = Hand;
