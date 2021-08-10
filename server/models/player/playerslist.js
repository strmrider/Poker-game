class PlayersList {
  constructor(players) {
    this.players = players;
    this.activePlayers = Array.from(players);
  }

  get length() {
    return this.players.length;
  }

  getPlayer(index) {
    return this.players[index];
  }

  get numberOfActive() {
    return this.activePlayers.length;
  }

  format() {
    let players = new Array();
    for (let i = 0; i < this.players.length; i++) {
      players.push(this.players[i].sum());
    }
    return players;
  }

  deactivatePlayer(player) {
    player.isActive = false;
    let index = this.activePlayers.indexOf(player);
    this.activePlayers.splice(index, 1);
  }

  nextActivePlayer(currentPlayer = null) {
    if (this.numberOfActive > 0) {
      if (currentPlayer) {
        let playerIndex = this.activePlayers.indexOf(currentPlayer) + 1;
        if (playerIndex < this.activePlayers.length)
          return this.activePlayers[playerIndex];
      }
      return this.activePlayers[0];
    }
    return null;
  }
}

module.exports.PlayersList = PlayersList;
