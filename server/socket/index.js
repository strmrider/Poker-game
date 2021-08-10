var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var enums = require("../constants/consts.js");
var reqconsts = require("../constants/requests.js");

var cardModule = require("../models/card/card.js");
var gameModule = require("../models/game/pendingGame.js");

var players = [
  { name: "player1", credit: 250 },
  { name: "player2", credit: 250 },
  { name: "player3", credit: 250 },
  { name: "player4", credit: 250 },
  { name: "player5", credit: 250 },
  { name: "player6", credit: 250 },
  { name: "player7", credit: 250 },
  { name: "player8", credit: 250 }
];

var communityCards = [
  { number: 2, suit: enums.Suit.Heart },
  { number: 8, suit: enums.Suit.Spade },
  { number: 9, suit: enums.Suit.Diamond },
  { number: 13, suit: enums.Suit.Spade },
  { number: 14, suit: enums.Suit.Club }
];

var userHoleCards = [
  { number: 7, suit: enums.Suit.Club },
  { number: 9, suit: enums.Suit.Diamond }
];

var clients = [];

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {
  console.log("a user connected");
  clients.push(socket);
  socket.emit(reqconsts.Request.New_Game, JSON.stringify(players));
  socket.emit(reqconsts.Request.Turn, JSON.stringify("player1"));
  socket.emit(reqconsts.Request.New_Card_player, JSON.stringify("player1"));
  socket.emit(
    reqconsts.Request.Bet_Response,
    JSON.stringify({ player: "player2", action: 0, amount: 20 })
  );
  socket.emit(reqconsts.Request.New_Card_Com, JSON.stringify(communityCards));
  socket.emit(reqconsts.Request.New_Card_User, JSON.stringify(userHoleCards));
  socket.emit(reqconsts.Request.Turn, JSON.stringify("user"));
  socket.on("betting", function(msg) {
    //socket.emit("betting", msg);
    console.log(clients.length);
    clients[0].emit("betting", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected. Disconnectioen event");
  });
});

http.listen(8080, () => {
  console.log("listening on *:8080");
});
