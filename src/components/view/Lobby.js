import React, { useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";

import { CssBaseline, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import NavBar from "../layout/NavBar";
import NavDrawer from "../layout/NavDrawer";
import CustomModal from "../common/CustomModal";

import { tryToCreateRoom } from "../../store/action/room";

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
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const [values, setValues] = useState({
    users: [],
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [room, setRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState({
    title: "",
    fields: [],
    buttons: [],
  });

  const boundRoomCreation = () => dispatch(tryToCreateRoom(firestore, values));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const roomHandler = (room) => {
    setRoom(room);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalOpen = (options) => {
    console.log(options);
    setModalOptions(options);
    setModalOpen(true);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    boundRoomCreation();
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar handleDrawerToggle={handleDrawerToggle} />
      <NavDrawer
        handleModalOpen={handleModalOpen}
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
      <CustomModal
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        fields={modalOptions.fields}
        buttons={modalOptions.buttons}
        title={modalOptions.title}
        handleClose={handleModalClose}
        open={modalOpen}
        values={values}
      />
    </div>
  );
};

export default Lobby;
