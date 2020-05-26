import React, { useState, Fragment } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import NavBar from "../layout/NavBar";
import NavDrawer from "../layout/NavDrawer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const Lobby = () => {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [room, setRoom] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const roomHandler = (room) => {
    setRoom(room);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar handleDrawerToggle={handleDrawerToggle} />
      <NavDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        toggleRoom={roomHandler}
      />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {room != null ? (
          <p>This is where the room should be {room.title}</p>
        ) : (
          <Fragment>
            {" "}
            <Typography variant={"h2"} component={"h3"}>
              Welcome to the lobby
            </Typography>
            <Typography paragraph variant={"subtitle1"}>
              Select a room from the menu on your left or create a new one.
            </Typography>
          </Fragment>
        )}
      </main>
    </div>
  );
};

export default Lobby;
