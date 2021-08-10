import { Injectable } from "@angular/core";
import { Game } from "../models/game";
import { SocketHandler } from "../models/socketHandler";
import reqConsts from "C:\\Users\\t\\Desktop\\poker app\\constants\\requests.js";

@Injectable({
  providedIn: "root"
})
export class SystemService {
  private currentGame: Game;
  private socketHandler: SocketHandler;
  constructor() {
    this.socketHandler = new SocketHandler();
    this.startNewGame();
  }

  public startNewGame() {
    this.currentGame = new Game(this.socketHandler);
    return this.game;
  }

  get game() {
    return this.currentGame;
  }

  emit(event_name: string, data) {
    this.socketHandler.emit(event_name, data);
  }
}
