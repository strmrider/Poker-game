const Ranks = {
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

const Suit = { Invalid: -1, Spade: 0, Heart: 1, Diamond: 2, Club: 3 };
const Color = { Black: 0, Red: 1 };

const Round = {
  None: 0,
  Initial: "Initial Bet",
  Pre_Flop: "Pre-Flop",
  Flop: "Flop",
  Turn: "Turn",
  River: "River",
  Over: "Over"
};

const Action = {
  Void: 0,
  Check: "Check",
  Call: "Call",
  Raise: "Raise",
  Fold: "Fold"
};

const Requests = {
  New_Game: 0,
  Join_Game: 1,
  Quit_Game: 2,
  HoleCard: 3,
  Comm_Card: 4,
  Bet: 5,
  Winner: 6,
  Chat: 7
};

module.exports.Color = Color;
module.exports.Suit = Suit;
module.exports.Ranks = Ranks;
module.exports.Round = Round;
module.exports.Action = Action;
