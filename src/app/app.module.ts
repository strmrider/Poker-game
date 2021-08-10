import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { CardComponent } from "./components/card/card.component";
import { TableComponent } from "./components/table/table.component";
import { PlayerComponent } from "./components/player/player.component";
import { GameComponent } from "./components/game/game.component";
import { UserBarComponent } from './components/userbar/user-bar/user-bar.component';
import { BetControllerComponent } from './components/userbar/bet-controller/bet-controller.component';
@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    TableComponent,
    PlayerComponent,
    GameComponent,
    UserBarComponent,
    BetControllerComponent
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
