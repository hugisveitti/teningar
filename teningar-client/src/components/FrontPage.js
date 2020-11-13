import { Grid, Button, Card, CardContent } from "@material-ui/core";
import React, { useState } from "react";
import SimpleDicePage from "./SimpleDicePage";
import OnlineDicePage from "./OnlineDicePage";
import "./FrontPage.css";

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
            <Grid item xs={6} style={{ margin: "auto" }}>
              <Button
                color="secondary"
                variant="contained"
                onClick={() => setPlayOption("ONLINE")}
              >
                Play online
              </Button>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Grid>
  );
};

export default FrontPage;
