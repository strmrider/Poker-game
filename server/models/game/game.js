var requestsModule = require("./requests.js");
var constants = require("../../constants/consts.js");
var reqconsts = require("../../constants/requests");
var deck = require("../card/deck.js");
var playersLostModule = require("../player/playerslist.js");

class Game {
  constructor(name, players) {
    this.name = name;
    this.playersList = new playersLostModule.PlayersList(players);

    // game's data
    this.deck = new deck.Deck();
    this.communityCards = new Array();
    this.round = constants.Round.None;
    this.currentBet = 0;
    this.calls = 0;
    this.jackpot = 0;

    for (let i = 0; i < this.playersList.players.length; i++) {
      this.subscribeToPlayersEvents(this.playersList.players[i]);
    }
  }

  subscribeToPlayersEvents(player) {
    player.events.on(reqconsts.Request.Bet_Response, bet => {
      this.handleBet(parseInt(bet), player);
    });
  }

  start() {
    this.deck.initialize();
    this.deck.shuffle(5);
    this.notifyPlayers(
      reqconsts.Request.Start_Game,
      JSON.stringify(this.playersList.format())
    );
    this.handleTurns();
  }

  // last player is null if betting round has just started (first active player)
  betRequest(lastPlayer = null) {
    if (this.calls < this.playersList.numberOfActive) {
      //if (lastPlayer) console.log("last player: ", lastPlayer.name);
      let nextPlayer = this.playersList.nextActivePlayer(lastPlayer);
      //console.log(nextPlayer);
      if (nextPlayer) {
        console.log("player bet request: ", nextPlayer.name);
        this.notifyPlayers(
          reqconsts.Request.Turn,
          JSON.stringify(nextPlayer.name)
        );
      }
    }
  }

  notifyPlayers(event, message, excludedPlayer = null) {
    for (let i = 0; i < this.playersList.length; i++) {
      let player = this.playersList.players[i];
      /*if (player.isActive) {
        if (excludedPlayer && player.name == excludedPlayer.name) continue;
        else {
          player.send(event, message);
        }
      }*/
      if (excludedPlayer && player.name == excludedPlayer.name) continue;
      else {
        player.send(event, message);
      }
    }
  }

  drawHoleCards() {
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < this.playersList.numberOfActive; i++) {
        let player = this.playersList.activePlayers[i];
        if (player.isActive) {
          let card = this.deck.draw();
          player.addHoleCard(card);
          player.send(
            reqconsts.Request.New_Card_User,
            JSON.stringify([card.serialize()])
          );
          this.notifyPlayers(
            reqconsts.Request.New_Card_player,
            JSON.stringify(player.name),
            player
          );
        }
      }
    }
  }

  drawCommunityCards(numberOfCards) {
    this.deck.burnTop();
    for (let i = 0; i < numberOfCards; i++) {
      this.communityCards.push(this.deck.draw());
    }

    this.notifyPlayers(
      reqconsts.Request.New_Card_Com,
      JSON.stringify(this.communityCards)
    );
  }

  handleBet(bet, player) {
    console.log(this.currentBet, bet, player.name);
    if (bet >= this.currentBet) {
      this.jackport += bet;
      player.credit -= bet;
    }
    if (bet > this.currentBet) {
      this.currentBet = bet;
      this.calls = 1;
    } else if (bet == this.currentBet) {
      this.calls++;
    } else {
      this.playersList.deactivatePlayer(player);
    }
    this.notifyPlayers(
      reqconsts.Request.Bet_Response,
      JSON.stringify({ player: player.name, bet: bet }),
      player
    );
    console.log(this.calls, this.playersList.numberOfActive);
    if (this.playersList.numberOfActive == 1) this.declareWinner();
    else if (this.calls < this.playersList.numberOfActive) {
      this.betRequest(player);
    } else this.handleTurns();
  }

  declareWinner() {
    let winner;
    let cards = null;
    if (this.playersList.numberOfActive == 1)
      winner = this.playersList.activePlayers[0];
    else {
      winner = this.getHighestHand();
      cards = new Array();
      for (let i = 0; i < this.playersList.numberOfActive; i++)
        cards.push(this.playersList.activePlayers[i].getHoleCardsFormat());
    }

    console.log("winner is: ", winner.name);
    this.notifyPlayers(
      reqconsts.Request.Winner,
      JSON.stringify({ winner: winner.name, playersCards: cards })
    );
  }

  startBettingRound() {
    this.calls = 0; //this.round == constants.Round.Initial ? 1 : 0;
    //this.currentBet = 0;
    this.betRequest();
  }

  nextRound() {
    switch (this.round) {
      case constants.Round.None:
        this.round = constants.Round.Initial;
        break;
      case constants.Round.Initial:
        this.round = constants.Round.Pre_Flop;
        break;
      case constants.Round.Pre_Flop:
        this.round = constants.Round.Flop;
        break;
      case constants.Round.Flop:
        this.round = constants.Round.Turn;
        break;
      case constants.Round.Turn:
        this.round = constants.Round.River;
        break;
      case constants.Round.River:
        this.round = constants.Round.Over;
        break;
    }

    this.notifyPlayers(reqconsts.Request.New_Round, JSON.stringify(this.round));
  }

  handleTurns() {
    this.nextRound();
    switch (this.round) {
      case constants.Round.Initial:
        this.startBettingRound();
        break;
      case constants.Round.Pre_Flop:
        this.drawHoleCards();
        this.startBettingRound();
        break;
      case constants.Round.Flop:
        this.drawCommunityCards(3);
        this.startBettingRound();
        break;
      case constants.Round.Turn:
      case constants.Round.River:
        this.drawCommunityCards(1);
        this.startBettingRound();
        break;
      case constants.Round.Over:
        this.declareWinner();
        break;
    }
  }

  getHighestHand() {
    var highest;
    var player;
    for (let i = 0; i < this.playersList.numberOfActive; i++) {
      player = this.playersList.activePlayers[i];
      if (player.isActive) {
        player.hand.computeRank(this.communityCards);
        if (highest) {
          let result = player.hand.compareTo(highest.hand);
          if (result == 1) highest = player;
        } else highest = player;
      }
    }

    return highest;
  }
}

module.exports.Game = Game;
