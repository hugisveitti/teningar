const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const http = require("http").Server(app);

var io = require("socket.io")(http, { cors: { origin: "*" } });

const port = process.env.PORT || 8000;
app.use(express.static(path.join(__dirname, "/teningar-client/build")));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/teningar-client/build/index.html");
});

app.get("/test", (req, res) => {
  res.send("hello world");
});

class Player {
  numberOfDicesLeft;
  name;
  roomName;
  id; // use uuid()
  socket;
  io;
  diceNumbers;
  score;
  constructor(name, roomName, io, socket) {
    this.originalNumberOfDice = 6;
    this.numberOfDicesLeft = this.originalNumberOfDice;
    this.name = name;
    this.roomName = roomName;
    this.id = name; // socket.id;
    this.io = io;
    this.socket = socket;
    this.diceNumbers = [];
    this.score = 0;
  }

  startGame() {
    this.numberOfDicesLeft = this.originalNumberOfDice;
  }

  finishedWithRound() {
    return this.numberOfDicesLeft === 0;
  }

  loseDice() {
    this.numberOfDicesLeft = this.numberOfDicesLeft - 1;
  }

  allowStartGame() {
    this.socket.emit("allowStartGame", {});
  }

  addToScore(addedScore) {
    this.score += addedScore;
  }

  rollDice() {
    this.diceNumbers = [];
    for (let i = 0; i < this.numberOfDicesLeft; i++) {
      this.diceNumbers[i] = parseInt(Math.random() * 6) + 1;
    }
    this.socket.emit("diceRolled", this.diceNumbers);
  }

  getNumberOfDice(diceValue) {
    let count = 0;
    for (let i = 0; i < this.diceNumbers.length; i++) {
      if (diceValue === this.diceNumbers[i]) {
        count++;
      }
    }
    return count;
  }
}

class DiceGuess {
  numberOfDice;
  diceValue;
  constructor(numberOfDice, diceValue) {
    this.numberOfDice = numberOfDice;
    this.diceValue = diceValue;
  }

  isSmaller(newGuess) {
    return (
      newGuess.numberOfDice > this.numberOfDice ||
      (newGuess.numberOfDice === this.numberOfDice &&
        newGuess.diceValue > this.diceValue)
    );
  }

  isLegal() {
    return (
      Number.isInteger(this.diceValue) &&
      Number.isInteger(this.numberOfDice) &&
      this.diceValue > 0 &&
      this.diceValue <= 6
    );
  }
}

// A game consists of many rounds
// one round consists of many turns
// one turn is one
class Game {
  roomName;
  players;
  gameStarted;

  io;
  leader;
  roundNumber;

  // guessTurn is true if betting is going on, before truthTurn
  isGuessTurn;

  constructor(roomName, io) {
    this.roomName = roomName;
    this.players = [];
    this.playerNames = [];
    this.gameStarted = false;
    this.io = io;
    this.leader = undefined;
    this.roundNumber = 0;
    this.playerGuessingDice = -1;
    this.playerGuessingTruth = -1;

    this.isGuessTurn = true;

    this.currentGuess = new DiceGuess(0, 1);

    this.playersFinishedWithGame = [];
  }

  addPlayer(playerName, socket) {
    if (this.gameStarted) {
      console.log("cannot add player if game started");
      socket.emit("errorJoining", {
        errorJoining: true,
        errorMsg: "Cannot join if game has started",
      });
      // go through list and find player with that name and kick him, add new player
      return;
    }
    let isUniquePlayerName = true;

    for (let i = 0; i < this.playerNames.length; i++) {
      if (this.playerNames[i] === playerName) {
        isUniquePlayerName = false;
      }
    }

    if (!isUniquePlayerName) {
      socket.emit("errorJoining", {
        errorJoining: true,
        errorMsg: "Name not available",
      });
      return;
    }
    socket.emit("errorJoining", {
      errorJoining: false,
      errorMsg: "",
    });

    const player = new Player(playerName, this.roomName, this.io, socket);
    if (this.leader === undefined) {
      this.leader = player;
      this.leader.allowStartGame();
      this.leader.socket.on("startGame", () => {
        this.startGame();
      });
    }
    this.players.push(player);
    this.playerNames.push(playerName);
    this.emitPlayerUpdate();
  }

  emitPlayerUpdate() {
    const playerNamesAndScore = [];
    for (let i = 0; i < this.players.length; i++) {
      playerNamesAndScore.push({
        score: this.players[i].score,
        name: this.players[i].name,
      });
    }
    this.io.to(this.roomName).emit("playerUpdate", playerNamesAndScore);
  }

  startGame() {
    this.gameStarted = true;
    this.io.to(this.roomName).emit("gameStarted", this.playerNames);
    this.playerGuessingDice = parseInt(Math.random() * this.players.length);
    if (this.playerGuessingDice === this.players.length - 1) {
      this.playerGuessingTruth = 0;
    } else {
      this.playerGuessingTruth = this.playerGuessingDice + 1;
    }
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].startGame();
    }
    setTimeout(() => this.startRound(), 1000);
  }

  gameOver() {
    // find loser
    let loser;
    for (let i = 0; i < this.players.length; i++) {
      if (!this.players[i].finishedWithRound()) {
        loser = this.players[i];
        this.players[i].addToScore(this.players.length - 1);
      }
    }
    const playerNamesAndScore = [];

    for (let i = 0; i < this.players.length; i++) {
      playerNamesAndScore.push({
        score: this.players[i].score,
        name: this.players[i].name,
      });
    }
    this.io.to(this.roomName).emit("gameOver", playerNamesAndScore);
  }

  startRound() {
    this.isGuessTurn = true;
    for (let i = 0; i < this.players.length; i++) {
      this.players[i].rollDice();
    }
    this.startTurn();
  }

  roundOver() {
    // count dice

    const currentDiceValue = this.currentGuess.diceValue;
    let totalNumberOfCurrentDice = 0;
    for (let i = 0; i < this.players.length; i++) {
      totalNumberOfCurrentDice =
        totalNumberOfCurrentDice +
        this.players[i].getNumberOfDice(currentDiceValue);
    }
    let infoMsg = "";
    let loser;
    if (totalNumberOfCurrentDice >= this.currentGuess.numberOfDice) {
      loser = this.playerGuessingTruth;
      infoMsg = `${this.players[this.playerGuessingTruth].name} wrongly said ${
        this.players[this.playerGuessingDice].name
      } was bluffing`;
    } else {
      loser = this.playerGuessingDice;
      infoMsg = `${this.players[this.playerGuessingTruth].name} called ${
        this.players[this.playerGuessingDice].name
      }'s bluff`;
    }
    const playersRoundInfo = [];
    for (let i = 0; i < this.players.length; i++) {
      playersRoundInfo.push({
        name: this.players[i].name,
        diceNumbers: this.players[i].diceNumbers,
      });
    }

    const info = { playersRoundInfo, infoMsg, loser: this.players[loser].name };

    this.io.to(this.roomName).emit("endOfRoundInfo", info);

    const scoreForWinningThisRound = this.playersFinishedWithGame.length;
    // every player and diceGuesser lose one
    for (let i = 0; i < this.players.length; i++) {
      if (i !== loser) {
        this.players[i].loseDice();
        if (this.players[i].finishedWithRound()) {
          this.players[i].addToScore(scoreForWinningThisRound);
          this.playersFinishedWithGame.push(i);
        }
      }
    }

    // check if game over
    if (this.playersFinishedWithGame.length === this.players.length - 1) {
      // round over
      this.gameOver();
    } else {
      this.playerGuessingTruth = this.getNextPlayer(this.playerGuessingDice);
      this.currentGuess = new DiceGuess(1, 0);

      this.startRound();
    }
  }

  sendInfo() {
    const playersFinished = [];
    for (let i = 0; i < this.playersFinishedWithGame.length; i++) {
      playersFinished.push(this.players[this.playersFinishedWithGame[i]].name);
    }
    const turnInfo = {
      playerGuessingDice: this.playerNames[this.playerGuessingDice],
      playerGuessingTruth: this.playerNames[this.playerGuessingTruth],
      currentGuess: this.currentGuess,
      isGuessTurn: this.isGuessTurn,
      playersFinished,
    };
    this.io.to(this.roomName).emit("turnInfo", turnInfo);
  }

  startTurn() {
    this.sendInfo();
    if (this.isGuessTurn) {
      this.getGuess();
    } else {
      this.getTruth();
    }
  }

  getNextPlayer(playerNumber) {
    let possibleNext = playerNumber;
    while (
      possibleNext in this.playersFinishedWithGame ||
      possibleNext === this.playerGuessingDice
    ) {
      possibleNext++;
      if (possibleNext >= this.players.length) {
        possibleNext = 0;
      }
    }
    return possibleNext;
  }

  prepareNextTurn() {
    this.playerGuessingDice = this.getNextPlayer(this.playerGuessingDice);
    this.playerGuessingTruth = this.getNextPlayer(this.playerGuessingDice);

    this.isGuessTurn = true;
    this.startTurn();
  }

  getTruth() {
    this.players[this.playerGuessingTruth].socket.emit("getTruth", {});
    this.players[this.playerGuessingTruth].socket.once("sendTruth", (data) => {
      if (data) {
        // next turn
        this.prepareNextTurn();
      } else {
        // says he was bluffing, see who was correct
        // send all of dice?
        // round over

        this.roundOver();
      }
    });
  }

  isEmpty() {
    return this.players.length === 0;
  }

  getGuess() {
    this.players[this.playerGuessingDice].socket.emit("getGuess", {});
    this.players[this.playerGuessingDice].socket.once("sendGuess", (data) => {
      const newGuess = new DiceGuess(data.numberOfDice, data.diceValue);
      if (newGuess.isLegal() && this.currentGuess.isSmaller(newGuess)) {
        this.players[this.playerGuessingDice].socket.emit("legalGuess", true);
        this.currentGuess = newGuess;
        this.isGuessTurn = false;
        this.startTurn();
      } else {
        this.players[this.playerGuessingDice].socket.emit("legalGuess", false);
        this.getGuess();
      }
    });
  }
}

const games = {};

io.on("connection", (socket) => {
  socket.join("room");
  let playerName = "";
  let playerRoom = "";

  socket.on("connectToRoom", (data) => {
    playerName = data.playerName;
    playerRoom = data.roomName;

    // join room with all players,
    // join room with only server and itself
    socket.leave(socket.room);
    socket.join(playerRoom);
    if (games[playerRoom] === undefined) {
      const newGame = new Game(playerRoom, io);
      games[playerRoom] = newGame;
    }

    games[playerRoom].addPlayer(playerName, socket);
  });

  socket.on("disconnect", (data) => {
    console.log("user disconnected");
    // find user and delete from game
    if (playerRoom !== "") {
      const indexOfPlayer = games[playerRoom].playerNames.indexOf(playerName);

      games[playerRoom].players.splice(indexOfPlayer, 1);
      games[playerRoom].playerNames.splice(indexOfPlayer, 1);
      if (indexOfPlayer in games[playerRoom].playersFinishedWithGame) {
        indexOfIndex = games[playerRoom].playersFinishedWithGame.indexOf(
          indexOfPlayer
        );
        games[playerRoom].playersFinishedWithGame.splice(indexOfIndex, 1);
      }
      if (games[playerRoom].isEmpty()) {
        // remove the room if all players disconnect
        // or if leader leaves
        delete games[playerRoom];
      } else {
        games[playerRoom].emitPlayerUpdate();
      }
    }
  });
});

http.listen(port, function () {
  console.log("listening on port " + port);
});
