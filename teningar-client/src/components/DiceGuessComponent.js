import React, { createRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Grid,
  Input,
  Button,
  InputLabel,
  Slider,
  CardHeader,
} from "@material-ui/core";
import ReactDice from "react-dice-complete";
import "react-dice-complete/dist/react-dice-complete.css";

const showDieRef = createRef();

const DiceGuessComponent = (props) => {
  const [diceGuess, setDiceGuess] = useState({ numberOfDice: 0, diceValue: 1 });

  const renderShowDie = () => {
    return (
      <ReactDice
        dotColor={"#eeeeee"}
        faceColor={"#111111"}
        numDice={1}
        rollTime={0.1}
        disableIndividual
        ref={showDieRef}
      />
    );
  };
  useEffect(() => {
    if (showDieRef.current && diceGuess.diceValue) {
      showDieRef.current.rollAll([diceGuess.diceValue]);
    }
  }, []);

  return (
    <Grid item xs={12}>
      <Card style={{ margin: "auto", padding: 15, maxWidth: 400 }}>
        <CardHeader title="Guess the dice" />
        <CardContent>
          <Grid item xs={12} style={{ paddingTop: 15 }}>
            <InputLabel>Number of Dice</InputLabel>
            <Input
              type="number"
              value={diceGuess.numberOfDice}
              onChange={(e) => {
                const num = parseInt(e.target.value);
                if (num) {
                  setDiceGuess({
                    ...diceGuess,
                    numberOfDice: parseInt(e.target.value),
                  });
                } else {
                  setDiceGuess({
                    ...diceGuess,
                    numberOfDice: "",
                  });
                }
              }}
            />
          </Grid>
          <Grid item xs={12} style={{ paddingTop: 15, paddingBottom: 15 }}>
            <InputLabel>Dice value</InputLabel>
            <Slider
              marks
              value={diceGuess.diceValue}
              onChange={(e, newValue) => {
                setDiceGuess({ ...diceGuess, diceValue: newValue });
                showDieRef.current.rollAll([newValue]);
              }}
              min={1}
              max={6}
            />
          </Grid>
          <Grid item xs={12}>
            {diceGuess.numberOfDice} of
            {renderShowDie()}
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={() => props.sendGuess(diceGuess)}
            >
              Send Guess
            </Button>
          </Grid>
          {props.illegalGuess && (
            <Grid item xs={12}>
              Guess was illegal
            </Grid>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default DiceGuessComponent;
