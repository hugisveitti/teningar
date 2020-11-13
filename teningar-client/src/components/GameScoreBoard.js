import React from "react";
import {
  TableContainer,
  Paper,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
} from "@material-ui/core";

const GameScoreBoard = (props) => {
  const headCellStyle = { fontWeight: "bold", textAlign: "center" };
  const cellStyle = { textAlign: "center" };
  return (
    <TableContainer style={{ margin: "auto", width: 300 }} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={headCellStyle}>Name</TableCell>
            <TableCell style={headCellStyle}>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.players.map((player) => (
            <TableRow key={player.name}>
              <TableCell style={cellStyle}>{player.name} </TableCell>
              <TableCell style={cellStyle}>{player.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GameScoreBoard;
