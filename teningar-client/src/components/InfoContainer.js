import React from "react";
import { Card, CardContent, Grid } from "@material-ui/core";

const InfoContainer = (props) => {
  return (
    <Grid item xs={12}>
      <Card style={{ margin: "auto", maxWidth: 400 }}>
        <CardContent>
          <Grid item xs={12}>
            {props.playerGuessingDice} betting on dice
          </Grid>
          <Grid item xs={12}>
            {props.playerGuessingTruth} calling {props.playerGuessingDice}'s bet
          </Grid>
          {props.isGuessTurn ? (
            <Grid item xs={12}>
              {props.playerGuessingDice} is about to make the bet
            </Grid>
          ) : (
            <Grid item xs={12}>
              {props.playerGuessingDice} has made the bet
            </Grid>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default InfoContainer;
