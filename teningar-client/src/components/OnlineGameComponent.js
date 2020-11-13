import React, { createRef, useEffect, useState } from "react";
import { Grid, Card, CardContent } from "@material-ui/core";
import ReactDice from "react-dice-complete";
import "react-dice-complete/dist/react-dice-complete.css";
import DiceComponent from "./DiceComponent";
import GameScoreBoard from "./GameScoreBoard";
import DiceGuessComponent from "./DiceGuessComponent";
import InfoContainer from "./InfoContainer";
import TruthGuessComponent from "../TruthGuessComponent";

const ref = createRef();

const currentDieRef = createRef();
const OnlineGameComponent = (props) => {
  const [diceNumbers, setDiceNumbers] = useState([]);
  const [illegalGuess, setIllegalGuess] = useState(false);
  const [diceGuessTurn, setDiceGuessTurn] = useState(false);
  const [truthGuessTurn, setTruthGuessTurn] = useState(false);
  const [playerGuessingTruth, setPlayerGuessingTruth] = useState("");
  const [playerGuessingDice, setPlayerGuessingDice] = useState("");
  const [currentGuess, setCurrentGuess] = useState({
    diceValue: 1,
    numberOfDice: 0,
  });
  const [isGuessTurn, setIsGuessTurn] = useState(true);

  useEffect(() => {
    if (!props.socket) return;
    props.socket.on("diceRolled", (data) => {
      setDiceNumbers(data);
      if (ref.current) {
        ref.current.rollAll(data);
      }
    });

    if (currentDieRef.current) {
      currentDieRef.current.rollAll([1]);
    }

    props.socket.on("turnInfo", (data) => {
      setPlayerGuessingDice(data.playerGuessingDice);
      setPlayerGuessingTruth(data.playerGuessingTruth);
      setCurrentGuess(data.currentGuess);
      setIsGuessTurn(data.isGuessTurn);
      currentDieRef.current.rollAll([data.currentGuess.diceValue]);
    });

    props.socket.on("getGuess", () => {
      setDiceGuessTurn(true);
    });

    props.socket.on("getTruth", () => {
      setTruthGuessTurn(true);
    });
  }, [props.socket]);

  const renderCurrentGuessDie = () => {
    return (
      <ReactDice
        dotColor={props.dotColor ?? "#ee77ee"}
        faceColor={props.faceColor ?? "#6f1111"}
        numDice={1}
        rollTime={0.1}
        disableIndividual
        ref={currentDieRef}
      />
    );
  };

  const sendTruth = (bool) => {
    props.socket.emit("sendTruth", bool);
    setTruthGuessTurn(false);
  };

  const sendGuess = (diceGuess) => {
    if (
      Number.isInteger(diceGuess.diceValue) &&
      Number.isInteger(diceGuess.numberOfDice) &&
      diceGuess.diceValue > 0 &&
      diceGuess.diceValue <= 6
    ) {
      props.socket.emit("sendGuess", diceGuess);
      props.socket.once("legalGuess", (bool) => {
        if (bool) {
          setDiceGuessTurn(false);
          setIllegalGuess(false);
        } else {
          setIllegalGuess(true);
        }
      });
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <DiceComponent ref={ref} numberOfDice={diceNumbers.length} />
      </Grid>

      <Grid item xs={12}>
        <Card style={{ maxWidth: 200, margin: "auto" }}>
          <CardContent>
            Current guess is {currentGuess.numberOfDice} of
            {renderCurrentGuessDie()}
          </CardContent>
        </Card>
      </Grid>
      {diceGuessTurn && (
        <DiceGuessComponent
          socket={props.socket}
          setDiceGuessTurn={setDiceGuessTurn}
          illegalGuess={illegalGuess}
          sendGuess={sendGuess}
        />
      )}
      {truthGuessTurn && <TruthGuessComponent sendTruth={sendTruth} />}
      <InfoContainer
        playerGuessingDice={playerGuessingDice}
        playerGuessingTruth={playerGuessingTruth}
        isGuessTurn={isGuessTurn}
      />

      <Grid item xs={12}>
        <h5>Players in game</h5>
      </Grid>
      <Grid item xs={12}>
        <GameScoreBoard players={props.players} />
      </Grid>
    </Grid>
  );
};

export default OnlineGameComponent;
