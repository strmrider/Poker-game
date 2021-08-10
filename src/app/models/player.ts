import card from "C:\\Users\\t\\Desktop\\poker app\\models\\card\\card.js";
import reqConsts from "C:\\Users\\t\\Desktop\\poker app\\constants\\requests.js";
import { EventEmitter } from "@angular/core";

export class Player {
  private _number: number;
  private _name: string;
  private _credit: number;
  private holeCards: Array<card.Card> = new Array();
  private activity: boolean = true;
  private deliveredCards: number = 0;
  private isPlayerTurn: boolean = false;
  private _lastTurnAction: number = 0;
  private winner: boolean = false;

  private _unveilCardsEmitter = new EventEmitter();

  constructor(name, credit, number, playerEvents) {
    this._name = name;
    this._credit = credit;
    this._number = number;

    playerEvents.subscribe(data => this.handleEvents(data));
  }

  private handleEvents(eventData) {
    if (eventData.event == reqConsts.Request.Turn) {
      if (this.name == eventData.data) this.isPlayerTurn = true;
      else this.isPlayerTurn = false;
      console.log("p turn: ", this.isPlayerTurn);
    } else if (eventData.event == reqConsts.Request.New_Card_player) {
      if (this.name == eventData.data) this.deliveredCards += 1;
    } else if (eventData.event == reqConsts.Request.Bet_Response) {
      this.handleBetresponse(eventData.data);
    } /*else if (eventData.event == reqConsts.Request.Winner)
    this.markAsWinner(eventData.data);*/
  }

  private handleBetresponse(bet) {
    if (this.name == bet.player) {
      if (bet.bet == -1) this.activity = false;
      else if (bet.bet >= 0) {
        this._lastTurnAction = bet.bet;
        this._credit -= bet.bet;
      }
    }
    this.isPlayerTurn = false;
  }

  public markAsWinner(pot) {
    /*if (data.winner == this._name) {
      console.log(this._name, ": im the winner");
      this.winner = true;
    }*/
    console.log(this._name, ": im the winner");
    this.winner = true;
    this._credit += pot;
  }

  unveilCards(cards) {
    for (let i = 0; i < cards.length; i++)
      this.holeCards.push(new card.Card(cards[i].number, cards[i].suit));
    this._unveilCardsEmitter.emit();
  }

  get number() {
    return this._number;
  }

  get name() {
    return this._name;
  }

  get credit() {
    return this._credit;
  }

  get cards() {
    return this.holeCards;
  }

  get numberOfCards() {
    return this.deliveredCards;
  }

  get isActive() {
    return this.activity;
  }

  get unveilCardsEmitter() {
    return this._unveilCardsEmitter;
  }

  get playerTurn() {
    return this.isPlayerTurn;
  }

  get isWinner() {
    return this.winner;
  }

  set active(status: boolean) {
    this.activity = status;
  }
}
