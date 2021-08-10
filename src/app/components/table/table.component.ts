import { Component, OnInit, Input } from "@angular/core";
import { SystemService } from "src/app/services/system.service";
import { Game } from "src/app/models/game";

@Component({
  selector: "poker-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit {
  private game: Game;
  constructor(private system: SystemService) {
    this.game = system.game;
  }

  ngOnInit() {}

  get cards() {
    return this.game.communityCards;
  }

  get round() {
    return this.game.round;
  }

  get bet() {
    return this.game.bet;
  }

  get pot() {
    return this.game.pot;
  }
}
