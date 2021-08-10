import cals from "C:\\Users\\t\\Desktop\\poker app\\models\\hand\\cals.js";
import card from "C:\\Users\\t\\Desktop\\poker app\\models\\card\\card.js";
import enums from "C:\\Users\\t\\Desktop\\poker app\\\constants\\consts.js";
import reqConsts from "C:\\Users\\t\\Desktop\\poker app\\constants\\requests.js";
import { Player } from "./player";
import { SocketHandler } from "./socketHandler";
import { Timer } from "./timer";

export class Game {
  private socketHandler: SocketHandler;
  /* user player data */
  private username: string = "user";
  private _credit: number = 850;
  private userTurn: boolean = false;
  private isUserActive: boolean = true;
  /* table game data */
  private _players: Array<Player> = new Array();
  private _communityCards: Array<card.Card> = new Array();
  private _holeCards: Array<card.Card> = new Array();
  private jackpot: number = 0;
  private _bet: number = 0;
  private _round: any = 0;

  private _timer: Timer = new Timer();

  constructor(socketHandler: SocketHandler) {
    this.username = "player" + Math.floor(Math.random() * 3000).toString();
    console.log(this.username);
    this.socketHandler = socketHandler;
    this.socketHandler.sendUsername(this.username);
    this.socketHandler.gameEventEmitter.subscribe(eventInfo =>
      this.handleEvents(eventInfo)
    );

    this._timer.timeUpEmitter.subscribe(() => {
      if (this.timer.time == 0) this.sendBet(-1);
    });
  }

  private handleEvents(eventData) {
    if (eventData.event == reqConsts.Request.Start_Game)
      this.restart(eventData.data);
    else if (eventData.event == reqConsts.Request.Turn) {
      this.handleTurn(eventData.data);
    } else if (eventData.event == reqConsts.Request.Bet_Response) {
      let data = eventData.data;
      this.handleBet(data.player, data.bet);
    } else if (
      eventData.event == reqConsts.Request.New_Card_Com ||
      eventData.event == reqConsts.Request.New_Card_User
    ) {
      this.setCards(eventData);
    } else if (eventData.event == reqConsts.Request.Winner)
      this.setWinner(eventData.data);
  }

  private setCards(eventData) {
    let cardsList = new Array();
    let cards = eventData.data;
    console.log(cards);
    for (let i = 0; i < cards.length; i++)
      cardsList.push(new card.Card(cards[i].number, cards[i].suit));

    if (eventData.event == reqConsts.Request.New_Card_Com)
      this._communityCards = cardsList;
    //this._communityCards.concat(cardsList);
    else if (eventData.event == reqConsts.Request.New_Card_User)
      this._holeCards = this._holeCards.concat(cardsList);
  }

  private handleTurn(playerName) {
    console.log("turn for: ", playerName);
    if (playerName == this.username) {
      this.userTurn = true;
      this._timer.start(30);
    } else this.userTurn = false;
  }

  private handleBet(playerName, bet) {
    bet = parseInt(bet);
    //let player = this.getPlayerByName(playerName);
    if (bet != -1) {
      this.jackpot += bet;
      if (bet > 0 || this._bet == 0) this._bet = bet;
    }
  }

  restart(data) {
    let playersArray = data;
    for (let i = 0; i < playersArray.length; i++)
      if (playersArray[i].name != this.username) {
        this._players.push(
          new Player(
            playersArray[i].name,
            playersArray[i].credit,
            i,
            this.socketHandler.playerEvent
          )
        );
      }
    this._round = "Initial bet";
  }

  /* game actions */
  sendBet(amount) {
    this.socketHandler.emit(reqConsts.Request.Bet_Response, amount);
    this.timer.stop();
    this.userTurn = false;
    // fold
    if (amount == -1) {
      console.log("folded");
      this.isUserActive = false;
    }
    // call/check
    else if (amount == 0) {
      this.jackpot += amount;
      console.log("called with " + this.bet);
    }
    // raise
    else if (amount > this._bet) {
      this._bet = amount;
      this.jackpot += amount;
      console.log("Raised to " + amount);
    }
  }

  private unveilPlayersCards(playersCards) {
    let currentPlayer;
    playersCards.forEach(player => {
      if (player.name != this.username) {
        currentPlayer = this.getPlayerByName(player.name);
        if (currentPlayer.isActive) currentPlayer.unveilCards(player.cards);
      }
    });
  }

  private setWinner(data) {
    console.log("winner is ", data.winner);
    if (data.winner != this.username) {
      let winner: Player = this.getPlayerByName(data.winner);
      winner.markAsWinner(this.jackpot);
    } else this._credit += this.jackpot;
    if (data.playersCards) this.unveilPlayersCards(data.playersCards);
  }

  private getPlayerByName(name: string) {
    let player;
    for (let i = 0; i < this.players.length; i++) {
      player = this.players[i];
      if (player.name == name) {
        console.log("fetched: ", player);
        return player;
      }
    }
    return null;
  }

  /* getters */
  get credit() {
    return this._credit;
  }

  get communityCards() {
    return this._communityCards;
  }

  get holeCards() {
    return this._holeCards;
  }

  get pot() {
    return this.jackpot;
  }

  get bet() {
    return this._bet;
  }

  get round() {
    return this._round;
  }

  get rank() {
    if (this.holeCards.length > 0 && this.communityCards.length > 0)
      return cals.computeHand(this.holeCards, this.communityCards);
    else return null;
  }

  get players() {
    return this._players;
  }

  get isUserTurn() {
    return this.userTurn;
  }

  get active() {
    return this.isUserActive;
  }

  get timer() {
    return this._timer;
  }
}
