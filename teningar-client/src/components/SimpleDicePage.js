import React, { createRef, useState } from "react";
import {
  Button,
  Input,
  Grid,
  InputLabel,
  Card,
  CardContent,
} from "@material-ui/core";
import DiceComponent from "./DiceComponent";

const SimpleDicePage = () => {
  const [numberOfDice, setNumberOfDice] = useState(6);
  const [diceFaceColor, setDiceFaceColor] = useState("#EEEEEE");
  const [diceDotColor, setDiceDotColor] = useState("#111111");
  const ref = createRef();

  const rollDice = () => {
    if (ref.current) {
      ref.current.rollAll();
    }
  };

  const removeDice = () => {
    if (numberOfDice > 0) {
      setNumberOfDice(numberOfDice - 1);
    }
  };
  const addDice = () => {
    setNumberOfDice(numberOfDice + 1);
  };

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      style={{ maxWidth: 800, margin: "auto" }}
    >
      <Grid item xs={12}>
        <DiceComponent
          dotColor={diceDotColor}
          faceColor={diceFaceColor}
          numberOfDice={numberOfDice}
          ref={ref}
        />
      </Grid>

      <Grid item xs={4}>
        <Button color="primary" variant="contained" onClick={rollDice}>
          Roll dice
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button color="primary" variant="contained" onClick={removeDice}>
          Remove dice
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button color="primary" variant="contained" onClick={addDice}>
          Add dice
        </Button>
      </Grid>
      <Grid item xs={6}>
        <InputLabel>Face color</InputLabel>
        <Input
          value={diceFaceColor}
          onChange={(e) => setDiceFaceColor(e.target.value)}
        />
      </Grid>
      <Grid item xs={6}>
        <InputLabel>Dot color</InputLabel>
        <Input
          label="Dot color"
          value={diceDotColor}
          onChange={(e) => setDiceDotColor(e.target.value)}
        />
      </Grid>
    </Grid>
  );
};

export default SimpleDicePage;
