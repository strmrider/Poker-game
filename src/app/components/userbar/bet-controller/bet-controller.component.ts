import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { SystemService } from "src/app/services/system.service";
import { Game } from "src/app/models/game";

@Component({
  selector: "bet-controller",
  templateUrl: "./bet-controller.component.html",
  styleUrls: ["./bet-controller.component.css"]
})
export class BetControllerComponent implements OnInit {
  @ViewChild("raiseSlider") private slider: ElementRef;
  private currentGame: Game;
  constructor(private systemService: SystemService) {
    this.currentGame = systemService.game;
  }

  ngOnInit() {}

  get credit() {
    return this.currentGame.credit;
  }

  get bet() {
    return this.currentGame.bet;
  }

  get minRaise() {
    return this.bet * 2;
  }

  get currentRaiseValue() {
    return this.slider.nativeElement.value;
  }

  get time() {
    return this.currentGame.timer.time;
  }

  /* Bet actions */

  fold() {
    this.currentGame.sendBet(-1);
  }

  call() {
    this.currentGame.sendBet(this.bet);
  }

  allIn() {
    this.slider.nativeElement.value = this.credit;
  }

  raise() {
    this.currentGame.sendBet(parseInt(this.slider.nativeElement.value));
  }

  get userturn() {
    return this.currentGame.isUserTurn;
  }

  get visibility() {
    if (this.userturn) return "visible";
    else return "hidden";
  }
}
