var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var enums = require("./constants/consts.js");
var reqconsts = require("./constants/requests.js");
var gameModule = require("./models/game/pendingGame.js");
var playerModule = require("./models/player/player.js");

pendingGame = new gameModule.PendingGame("game1", null, 3);
var game;
io.on("connection", socket => {
  socket.on("connection", name => {
    console.log(name + " has connected");
    let player = new playerModule.Player(name, 1000, false, socket);
    pendingGame.addPlayer(player);
    if (pendingGame.isReady()) {
      game = pendingGame.start();
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected. Disconnectioen event");
  });
});

http.listen(8080, () => {
  console.log("listening on *:8080");
});
