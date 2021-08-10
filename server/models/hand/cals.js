var utils = require("./utils.js");
var rankModule = require("./rank.js");
var enums = require("../../constants/consts.js");

class CurrentHighest {
  constructor(_rank, combination) {
    this.set(_rank, combination);
  }

  set(_rank, combination) {
    if (_rank) this.rank = _rank;
    else this.rank = new rankModule.HandRank(enums.Ranks.None);
    if (combination) {
      this.combination = new Array();
      for (let i = 0; i < 5; i++) {
        this.combination.push(combination[i]);
      }
    }
  }
}

var isStraight = function(cards) {
  for (let i = 0; i < 5 - 1; i++) {
    if (cards[i].number + 1 != cards[i + 1].number) return false;
  }
  return true;
};

var isFlush = function(cards) {
  for (let i = 0; i < 5 - 1; i++) {
    if (
      cards[i].suit != cards[i + 1].suit ||
      cards[i].color != cards[i + 1].color
    )
      return false;
  }
  return true;
};

var filterCardslistDuplicatios = function(cards, multiCards) {
  let cardsNumList = new Array();
  for (let i = 0; i < cards.length; i++) {
    if (
      multiCards[0] != cards[i].number &&
      multiCards[1] != cards[i].number &&
      multiCards[2] != cards[i].number
    )
      cardsNumList.push(cards[i].number);
  }

  return cardsNumList;
};

var getOrderForMulHand = function(numbers) {
  let orderedList = new Array(2);
  if (numbers[0] > numbers[1]) {
    orderedList[0] = numbers[0];
    orderedList[1] = numbers[1];
  } else {
    orderedList[0] = numbers[1];
    orderedList[1] = numbers[0];
  }
  return orderedList;
};

var isMulti = function(cards) {
  cardsNumbers = new Array();
  for (let i = 0; i < 3; i++) cardsNumbers.push(0);
  let multiplicity = 0;
  for (let i = 0; i < 5 - 1; i++) {
    if (cards[i].number == cards[i + 1].number) {
      cardsNumbers[multiplicity] = cards[i].number;
      multiplicity++;
    }
  }
  return cardsNumbers;
};

var numberOfMulti = function(cardsNumbers, cards) {
  let filteredCardsList = filterCardslistDuplicatios(cards, cardsNumbers);
  // high card
  if (cardsNumbers[0] == 0) {
    return new rankModule.HandRank(
      enums.Ranks.High_Card,
      0,
      0,
      filteredCardsList
    );
  }
  // pair
  else if (cardsNumbers[1] == 0) {
    return new rankModule.HandRank(
      enums.Ranks.Pair,
      cardsNumbers[0],
      0,
      filteredCardsList
    );
  }
  // three of a kind or two pairs
  else if (cardsNumbers[2] == 0) {
    // three of a kind
    if (cardsNumbers[0] == cardsNumbers[1])
      return new rankModule.HandRank(
        enums.Ranks.Three_Of_A_kind,
        cardsNumbers[0],
        0,
        filteredCardsList
      );
    // two pairs
    else {
      // get priority order- higher pair than lower
      let ordered = getOrderForMulHand(cardsNumbers);
      return new rankModule.HandRank(
        enums.Ranks.Two_Pair,
        ordered[0],
        ordered[1],
        filteredCardsList
      );
    }
  }
  // for of a kind or full house
  else {
    // four of kind
    if (
      cardsNumbers[0] == cardsNumbers[1] &&
      cardsNumbers[1] == cardsNumbers[2]
    )
      return new rankModule.HandRank(
        enums.Ranks.Four_Of_A_Kind,
        cardsNumbers[0],
        0,
        filteredCardsList
      );
    // full house
    else {
      // get priority order- three than the pair
      let ordered = getOrderForMulHand(cardsNumbers);
      return new rankModule.HandRank(
        enums.Ranks.Full_House,
        ordered[0],
        ordered[1],
        filteredCardsList
      );
    }
  }
};

var getPlayerHand = function(cards) {
  utils.sort(cards);
  let multiplicity = numberOfMulti(isMulti(cards), cards);
  let flush = isFlush(cards);
  let straight = isStraight(cards);

  if (straight && flush) {
    if (cards[4].number == 14)
      return new rankModule.HandRank(enums.Ranks.Royal_Flush);
    else
      return new rankModule.HandRank(
        enums.Ranks.Straight_Flush,
        cards[4].number,
        0,
        null
      );
  } else if (
    multiplicity.type == enums.Ranks.Four_Of_A_Kind ||
    multiplicity.type == enums.Ranks.Full_House
  )
    return multiplicity;
  else if (flush) return new rankModule.HandRank(enums.Ranks.Flush);
  else if (straight)
    return new rankModule.HandRank(
      (rank = enums.Ranks.Straight),
      (firstvalue = cards[4].number),
      (uninvolvedCards = cards)
    );
  else if (multiplicity.type != enums.Ranks.None) return multiplicity;
  else
    return new rankModule.HandRank(
      (tank = enums.Ranks.High_Card),
      (uninvolvedCards = cards)
    );
};

var indicesToCards = function(cards, indices) {
  let cardsList = new Array();
  for (let i = 0; i < indices.length; i++) cardsList.push(cards[indices[i]]);

  return cardsList;
};

var getBestHand = function(
  allCards,
  currentCombination,
  currentHighest,
  start,
  end,
  index,
  r
) {
  if (index == r) {
    let result = getPlayerHand(indicesToCards(allCards, currentCombination));
    if (result.compareTo(currentHighest.rank) == 1) {
      currentHighest.set(result, currentCombination);
    }
    return;
  }

  for (let i = start; i <= end && end - i + 1 >= r - index; i++) {
    currentCombination[index] = i;
    getBestHand(
      allCards,
      currentCombination,
      currentHighest,
      i + 1,
      end,
      index + 1,
      r
    );
  }
};

var computeHand = function(holeCards, communityCards) {
  let allCards = new Array();
  allCards.push(holeCards[0]);
  allCards.push(holeCards[1]);

  for (let i = 0; i < communityCards.length; i++)
    allCards.push(communityCards[i]);

  let currentBestHand = new CurrentHighest();
  let currentCombination = new Array();
  /*currentCombination.push(0);
  currentCombination.push(1);
  currentCombination.push(2);
  currentCombination.push(3);
  currentCombination.push(4);*/
  getBestHand(
    allCards,
    currentCombination,
    currentBestHand,
    0,
    allCards.length - 1,
    0,
    5
  );
  //console.log(currentBestHand);
  return currentBestHand.rank;
};

module.exports.computeHand = computeHand;
