import { Grid, Button, Card, CardContent, Tooltip } from "@material-ui/core";
import React, { useState } from "react";
import SimpleDicePage from "./SimpleDicePage";
import OnlineDicePage from "./OnlineDicePage";
import "./FrontPage.css";

const gameRulesText =
  "Everybody roles their dice, then the first better bets how many dice are of one variant on the table (sum of all players dice). The challenger, calls his bet by saying it is true or a bluff. If he says its true then he becomes the bettor, and he needs to bet either a higher variant and same number of dice or a higher number of dice. If he says its a bluff then one of the players loses a dice. The player first to lose all of the dice wins, and last loses. If you lose you get a point.";

const FrontPage = () => {
  const [playOption, setPlayOption] = useState("NONE");

  return (
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      className="container"
    >
      {playOption === "SIMPLE" && (
        <Grid item xs={12}>
          <SimpleDicePage />
        </Grid>
      )}
      {playOption === "ONLINE" && (
        <Grid item xs={12}>
          <OnlineDicePage />
        </Grid>
      )}
      {playOption === "NONE" && (
        <Card style={{ width: 300, marginTop: 30 }}>
          <CardContent>
            <Grid item xs={6} style={{ paddingBottom: 20, margin: "auto" }}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => setPlayOption("SIMPLE")}
              >
                Play simple
              </Button>
            </Grid>
            <Grid item xs={6} style={{ margin: "auto", marginBottom: 20 }}>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => setPlayOption("ONLINE")}
              >
                Play online
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Tooltip title={gameRulesText} style={{ width: 350 }}>
                <Button variant="contained" style={{ width: 100 }}>
                  Rules
                </Button>
              </Tooltip>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Grid>
  );
};

export default FrontPage;
