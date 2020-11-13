import React, { createRef, useEffect, useState } from "react";
import {
  Modal,
  makeStyles,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import DiceComponent from "./DiceComponent";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const EndOfRoundInfoComponent = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();
  const [roundInfoMsg, setRoundInfoMsg] = useState("");
  const [playersRoundInfo, setPlayersRoundInfo] = useState([]);

  useEffect(() => {
    if (props.data) {
      setIsOpen(true);
      setPlayersRoundInfo(props.data.playersRoundInfo);
      setRoundInfoMsg(props.data.infoMsg);
    }
  }, [props.data]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const renderPersonInfo = (player) => {
    const ref = createRef();
    return (
      <TableRow key={player.name}>
        <TableCell align="center">{player.name}</TableCell>
        <TableCell align="center">
          <DiceComponent
            diceNumbers={player.diceNumbers}
            numberOfDice={player.diceNumbers.length}
            dieSize={20}
            margin={3}
            ref={ref}
          />
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Modal open={isOpen} onClose={handleClose} className={classes.modal}>
      <div className={classes.paper}>
        <h3>End of round info</h3>
        <p>{roundInfoMsg}</p>
        <h5>Player's dice</h5>
        <TableContainer>
          <Table>
            <TableBody>
              {playersRoundInfo?.map((playerInfo) => {
                return renderPersonInfo(playerInfo);
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Modal>
  );
};

export default EndOfRoundInfoComponent;
