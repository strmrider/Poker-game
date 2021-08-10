var gameModule = require("./game.js");

class PendingGame {
  constructor(name, password, participants) {
    this.name = name;
    this.password = password;
    this.participants = participants;
    this.players = new Array();
  }

  addPlayer(player) {
    if (this.players.length < this.participants) this.players.push(player);
    else throw "Maximum number of participants has been reached";
  }

  removePlayer(playerName) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].name == playerName) this.players.splice(i, 1);
    }
  }

  start() {
    let game = new gameModule.Game(this.name, this.players);
    game.start();
    return game;
  }

  isReady() {
    return this.players.length == this.participants;
  }
}

module.exports.PendingGame = PendingGame;
