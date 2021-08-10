import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"]
})
export class CardComponent implements OnInit {
  @Input() private number: any;
  @Input() private suit: any;
  @Input() private type: any;
  private path: string;

  constructor() {}

  ngOnInit() {
    if (this.number) {
      let dir = "\\assets\\poker_cards\\";
      this.path =
        dir + this.number.toString() + "_of_" + this.suitAsString + ".png";
    }
  }

  private get suitAsString() {
    switch (this.suit) {
      case 0:
        return "spades";
      case 1:
        return "hearts";
      case 2:
        return "diamonds";
      case 3:
        return "clubs";
    }
  }

  get getPath() {
    if (this.type == "back") return "\\assets\\card_back.jpg";
    else return this.path;
  }

  get getClassName() {
    if (this.type == "community") return "community-card";
    else if (this.type == "hole") return "hole-card";
    else if (this.type == "back") return "back-card";
  }
}
