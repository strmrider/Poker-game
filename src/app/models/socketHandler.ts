import * as io from "socket.io-client";
import reqConsts from "C:\\Users\\t\\Desktop\\poker app\\constants\\requests.js";
import { EventEmitter } from "@angular/core";

export class SocketHandler {
  private socket: io;
  private readonly serverURL = "localhost:8080";

  /* Emitters */
  private _gameEventEmitter = new EventEmitter();
  private _playerEvent = new EventEmitter();

  constructor() {
    this.socket = io(this.serverURL);
    this.listen();
  }

  private listen() {
    // start new game
    this.socket.on(reqConsts.Request.Start_Game, data => {
      console.log(data);
      let pack = {
        event: reqConsts.Request.Start_Game,
        data: JSON.parse(data)
      };
      this._gameEventEmitter.emit(pack);
    });

    // new community card
    this.socket.on(reqConsts.Request.New_Card_Com, data => {
      let pack = {
        event: reqConsts.Request.New_Card_Com,
        data: JSON.parse(data)
      };
      this._gameEventEmitter.emit(pack);
    });

    // new user card
    this.socket.on(reqConsts.Request.New_Card_User, data => {
      let pack = {
        event: reqConsts.Request.New_Card_User,
        data: JSON.parse(data)
      };
      this._gameEventEmitter.emit(pack);
    });

    // new turn
    this.socket.on(reqConsts.Request.Turn, data => {
      let pack = {
        event: reqConsts.Request.Turn,
        data: JSON.parse(data)
      };
      this._playerEvent.emit(pack);
      this._gameEventEmitter.emit(pack);
    });

    // new player card from dealer
    this.socket.on(reqConsts.Request.New_Card_player, data => {
      this._playerEvent.emit({
        event: reqConsts.Request.New_Card_player,
        data: JSON.parse(data)
      });
    });

    // a player's bet update
    this.socket.on(reqConsts.Request.Bet_Response, data => {
      let pack = {
        event: reqConsts.Request.Bet_Response,
        data: JSON.parse(data)
      };
      this._playerEvent.emit(pack);
      this._gameEventEmitter.emit(pack);
    });

    // winner update
    this.socket.on(reqConsts.Request.Winner, data => {
      let pack = {
        event: reqConsts.Request.Winner,
        data: JSON.parse(data)
      };
      this._playerEvent.emit(pack);
      this._gameEventEmitter.emit(pack);
    });
  }

  public emit(event_name: string, data: any) {
    this.socket.emit(event_name, data);
  }

  public sendUsername(username: string) {
    this.emit("connection", username);
  }

  get gameEventEmitter() {
    return this._gameEventEmitter;
  }

  get playerEvent() {
    return this._playerEvent;
  }
}
