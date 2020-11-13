import { Input, Button, Grid, Card, CardContent } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { config } from "../config";
import WaitingRoom from "./WaitingRoom";

const ENDPOINT = config.ENDPOINT;
const OnlineDicePage = () => {
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const [connectedToRoom, setConnectedToRoom] = useState(false);
  const [socket, setSocket] = useState(undefined);
  const [errorJoining, setErrorJoining] = useState(false);
  const [errorJoiningMsg, setErrorJoiningMsg] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);
    socket.on("connectedToRoomCallBack", (data) => {});
  }, []);

  const connectToRoom = () => {
    socket.emit("connectToRoom", { playerName: name, roomName: roomName });
    socket.once("errorJoining", (data) => {
      if (!data.errorJoining) {
        setConnectedToRoom(true);
        setErrorJoining(false);
        setErrorJoiningMsg("");
      } else {
        setErrorJoining(true);
        setErrorJoiningMsg(data.errorMsg);
      }
    });
  };

  const renderConnectToRoom = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <h3>Online dice page</h3>
      </Grid>
      <Grid item xs={12}>
        <p>
          In room name write some name, e.g. "party", "p" or anything. Then make
          your friends write the same name to connect to your room.
        </p>
        <p>If you lose connection you can just join again with the same name</p>
      </Grid>
      <Card style={{ margin: "auto" }}>
        <CardContent>
          <Grid item xs={12}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
          </Grid>
          <Grid item xs={12} style={{ paddingTop: 15, paddingBottom: 15 }}>
            <Input
              placeholder="Room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" variant="contained" onClick={connectToRoom}>
              Connect to room
            </Button>
          </Grid>
          {errorJoining && (
            <Grid item xs={12}>
              {errorJoiningMsg}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Grid>
  );

  return !connectedToRoom ? (
    renderConnectToRoom()
  ) : (
    <WaitingRoom roomName={roomName} socket={socket} />
  );
};

export default OnlineDicePage;
