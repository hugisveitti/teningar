import React, { forwardRef } from "react";
import ReactDice from "react-dice-complete";
import "react-dice-complete/dist/react-dice-complete.css";

const DiceComponent = forwardRef((props, ref) => {
  return (
    <ReactDice
      dotColor={props.dotColor ?? "#eeeeee"}
      faceColor={props.faceColor ?? "#111111"}
      numDice={props.numberOfDice}
      rollTime={0.5}
      ref={ref}
      disableIndividual
    />
  );
});

export default DiceComponent;
