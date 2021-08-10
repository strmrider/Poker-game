import { Component, OnInit } from "@angular/core";
import { SystemService } from "src/app/services/system.service";
import { Game } from "src/app/models/game";

@Component({
  selector: "user-bar",
  templateUrl: "./user-bar.component.html",
  styleUrls: ["./user-bar.component.css"]
})
export class UserBarComponent implements OnInit {
  private game: Game;
  constructor(private system: SystemService) {
    this.game = system.game;
  }

  ngOnInit() {}

  get rank() {
    return this.game.rank;
  }
}
