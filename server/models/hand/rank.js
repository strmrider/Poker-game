var utils = require("./utils.js");

var compareRanks = function(first, second) {
  if (first > second) return 1;
  else if (first < second) return -1;
  else return 0;
};

const Ranks = {
  Compare: compareRanks,
  None: 0,
  High_Card: 1,
  Pair: 2,
  Two_Pair: 3,
  Three_Of_A_kind: 4,
  Straight: 5,
  Flush: 6,
  Full_House: 7,
  Four_Of_A_Kind: 8,
  Straight_Flush: 9,
  Royal_Flush: 10
};

class HandRank {
  constructor(rank, firstValue, secondValue, uninvolvedCards) {
    this.rank = rank;
    this.firstValue = firstValue ? firstValue : 0;
    this.secondValue = secondValue ? secondValue : 0;
    this.uninvolvedCards = uninvolvedCards ? uninvolvedCards : [];
  }

  compareVals(secondHand) {
    if (this.firstValue > secondHand.firstValue) return 1;
    else if (this.firstValue < secondHand.firstValue) return -1;
    else {
      if (this.rank == Ranks.Full_House || this.rank == Ranks.Two_Pair) {
        if (this.secondValue > secondHand.secondValue) return 1;
        else if (this.secondValue < secondHand.secondValue) return -1;
      }
    }

    return 0;
  }

  compareTo(secondRank) {
    if (secondRank.rank == Ranks.None) return 1;
    let firstCompare = compareRanks(this.rank, secondRank.rank);
    if (firstCompare == 0) {
      switch (this.rank) {
        case Ranks.Royal_Flush:
          return 0;
        case Ranks.Straight_Flush:
        case Ranks.Straight:
          return this.compareVals(secondRank);
        // if multi results(pairs or three) are  still equal, checks the rest of the cards
        case Ranks.Pair:
        case Ranks.Two_Pair:
        case Ranks.Three_Of_A_kind:
        case Ranks.Four_Of_A_Kind:
          let result = this.compareVals(secondRank);
          if (result != 0) return result;
          else {
            return utils.compareNumbersList(
              this.uninvolvedCards,
              secondRank.uninvolvedCards
            );
          }
        // check all cards for higher one
        case Ranks.High_Card:
        case Ranks.Flush:
          return utils.compareNumbersList(
            this.uninvolvedCards,
            secondRank.uninvolvedCards
          );
        default:
          return -2; // Void
      }
    } else return firstCompare;
  }

  toString() {
    switch (this.rank) {
      case Ranks.None:
        return "None";
      case Ranks.High_Card:
        return "High card";
      case Ranks.Pair:
        return "Pair";
      case Ranks.Two_Pair:
        return "Two Pair";
      case Ranks.Three_Of_A_kind:
        return "Three Of A kind";
      case Ranks.Straight:
        return "Straight";
      case Ranks.Flush:
        return "Flush";
      case Ranks.Full_House:
        return "Full House";
      case Ranks.Four_Of_A_Kind:
        return "Four Of A Kind";
      case Ranks.Straight_Flush:
        return "Straight Flush";
      case Ranks.Royal_Flush:
        return "Royal Flush";
    }
  }
}

module.exports.HandRank = HandRank;
