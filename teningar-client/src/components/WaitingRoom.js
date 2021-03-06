import { Grid, Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import OnlineGameComponent from "./OnlineGameComponent";
import GameScoreBoard from "./GameScoreBoard";

const WaitingRoom = (props) => {
  const [players, setPlayers] = useState([]);
  // sorted by score
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    props.socket.on("playerUpdate", (data) => {
      setPlayers(data.playerNamesAndScore);
      setSortedPlayers(data.playerNamesAndScore);
      setGameStarted(data.gameStarted);
    });

    props.socket.on("allowStartGame", (data) => {
      setIsLeader(true);
    });

    props.socket.on("gameStarted", () => {
      setGameStarted(true);
    });

    props.socket.on("gameOver", (data) => {
      setGameStarted(false);
      setPlayers(data);
      setSortedPlayers(data);
    });
  }, [props.socket]);

  const startGame = () => {
    props.socket.emit("startGame", {});
  };

  const renderWaitingRoom = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h3>Waiting room for room '{props.roomName}'</h3>
      </Grid>
      <Grid item xs={12}>
        <p>Waiting for leader to press play.</p>
      </Grid>
      <Grid item xs={12}>
        <p>
          You want the least points. You get 0 points for winning. You get 1
          point if a there was one person to finish before you and etc.
        </p>
      </Grid>
      <Grid item xs={12}>
        <h5>Players waiting</h5>
      </Grid>
      <Grid item xs={12}>
        <GameScoreBoard players={sortedPlayers} />
      </Grid>
      {isLeader && (
        <Grid item xs={12}>
          <Button onClick={startGame} variant="contained">
            Start game
          </Button>
        </Grid>
      )}
    </Grid>
  );

  return !gameStarted ? (
    renderWaitingRoom()
  ) : (
    <OnlineGameComponent players={players} socket={props.socket} />
  );
};

export default WaitingRoom;
