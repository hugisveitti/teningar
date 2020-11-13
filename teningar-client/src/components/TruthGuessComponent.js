import React from "react";
import { Card, CardContent, CardHeader, Grid, Button } from "@material-ui/core";

const TruthGuessComponent = (props) => {
  return (
    <Card style={{ margin: "auto", marginBottom: 20 }}>
      <CardHeader title="Is the guess truth or Bluff?" />
      <CardContent>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => props.sendTruth(true)}
          >
            Truth
          </Button>
        </Grid>
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => props.sendTruth(false)}
          >
            Bluffing
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TruthGuessComponent;
