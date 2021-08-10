import { Component, OnInit } from "@angular/core";
import { SystemService } from "src/app/services/system.service";
import { Game } from "src/app/models/game";

@Component({
  selector: "poker-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit {
  private game: Game;
  constructor(private system: SystemService) {
    this.game = system.game;
  }

  ngOnInit() {}

  get players() {
    return this.game.players;
  }

  get userCards() {
    return this.game.holeCards;
  }
}
