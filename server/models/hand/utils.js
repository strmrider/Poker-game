// bubble sort is more effiecnt with small arrays in compare to the recursive algorithms
var sort = function(cards) {
  let tempCard;
  for (let i = 0; i < cards.length - 1; i++) {
    for (let j = 0; j < cards.length - 1; j++) {
      if (cards[j].compare(cards[j + 1]) == 1) {
        tempCard = cards[j + 1];
        cards[j + 1] = cards[j];
        cards[j] = tempCard;
      }
    }
  }
};

var compareNumbersList = function(firstList, secondList) {
  for (let i = 0; i < firstList.length; i++) {
    if (firstList[i] > secondList[i]) return 1;
    else if (firstList[i] < secondList[i]) return -1;
  }
  return 0;
};

module.exports.sort = sort;
module.exports.compareNumbersList = compareNumbersList;
