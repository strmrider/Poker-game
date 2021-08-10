import { Component, OnInit, Input } from "@angular/core";
import { Player } from "src/app/models/player";
import { SystemService } from "src/app/services/system.service";

@Component({
  selector: "player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"]
})
export class PlayerComponent implements OnInit {
  @Input() playerObj: Player;
  private unveil: boolean = false;
  private winner: boolean = false;
  constructor(private system: SystemService) {}

  ngOnInit() {
    this.playerObj.unveilCardsEmitter.subscribe(() => {
      this.unveil = true;
    });
  }

  get cardsType() {
    if (this.unveil) return "hole";
    else return "back";
  }

  get cards() {
    return this.playerObj.cards;
  }

  get name() {
    return this.playerObj.name;
  }

  get credit() {
    return this.playerObj.credit;
  }

  get expose() {
    return this.unveil;
  }

  get numberOfCards() {
    if (!this.active) return new Array(0);
    else {
      let sizeArray = new Array(this.playerObj.numberOfCards);
      return sizeArray;
    }
  }

  get className() {
    if (!this.playerObj.isActive) return "player-container-inactive";
    else if (this.playerObj.playerTurn) return "player-container-turn";
    else if (this.playerObj.isWinner) return "player-container-winner";
  }

  get active() {
    return this.playerObj.isActive;
  }

  get detailsClassName() {
    if (this.playerObj.numberOfCards > 0) return "player-details-container";
    else "";
  }
}
