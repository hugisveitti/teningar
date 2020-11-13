import React, { forwardRef, useEffect } from "react";
import ReactDice from "react-dice-complete";
import "react-dice-complete/dist/react-dice-complete.css";

const DiceComponent = forwardRef((props, ref) => {
  useEffect(() => {
    if (props.diceNumbers) {
      ref.current.rollAll(props.diceNumbers);
    }
  }, [ref, props.diceNumbers]);

  return (
    <ReactDice
      dotColor={props.dotColor ?? "#eeeeee"}
      faceColor={props.faceColor ?? "#111111"}
      numDice={props.numberOfDice}
      rollTime={0.5}
      ref={ref}
      disableIndividual
      dieSize={props.dieSize ?? 60}
      value={props.diceNumbers}
      margin={props.margin ?? 15}
    />
  );
});

export default DiceComponent;
