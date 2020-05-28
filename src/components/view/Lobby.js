import React, { useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore } from "react-redux-firebase";

import { CssBaseline, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import NavBar from "../layout/NavBar";
import NavDrawer from "../layout/NavDrawer";
import CustomModal from "../common/CustomModal";

import { tryToCreateRoom } from "../../store/action/room";
import Room from "./Room";
import { Redirect } from "react-router";

/**
 * Function for returning the styles object.
 */
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 2000,
    padding: theme.spacing(2),
  },
  lobbyTitle: {
    textAlign: "center",
  },
}));

/**
 * Functional component for returning the lobby ui
 * and handling base logic such as setting a room
 * upon clicking a room in the drawer list.
 *
 * As well as handling menu and modal states and dispatching
 * actions regarding the creation of rooms.
 */
const Lobby = () => {
  const classes = useStyles(); // variable containing our style object.
  const dispatch = useDispatch(); // variable containing the dispatch function.
  const firestore = useFirestore(); // variable containing our instance of firestore.
  const [values, setValues] = useState({
    users: [],
  }); // Values variable containing the specifics needed to create a room which is sent to the "tryCreateRoom" action.
  const auth = useSelector((state) => state.firebase.auth);
  const [mobileOpen, setMobileOpen] = useState(false); // mobile menu state, open or closed.
  const [room, setRoom] = useState(null); // selected room state, null if not selected, else it contains an object with the room details.
  const [modalOpen, setModalOpen] = useState(false); // modal state, open or closed.
  const [modalOptions, setModalOptions] = useState({
    title: "",
    fields: [],
    buttons: [],
  }); // options state for the modal, containing the wanted fields, buttons and title.

  const boundRoomCreation = () => dispatch(tryToCreateRoom(firestore, values)); // Binding the dispatch in an arrow function.

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  }; // Arrow function that handles the state change for our mobile view drawer.

  const roomHandler = (room) => {
    setRoom(room);
  }; // Arrow function that handles the state change for our room state.

  const handleModalClose = () => {
    setModalOpen(false);
  }; // Arrow function that handles closing our modal.

  const handleModalOpen = (options) => {
    setModalOptions(options);
    setModalOpen(true);
  }; // Arrow function that handles opening our modal and setting the modals options.

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  }; // Handles changes of our room values needed for creating a new room.

  const handleSubmit = (event) => {
    event.preventDefault();
    boundRoomCreation();
  }; // Arrow function that handles the submission of our modal forms.

  /**
   * Checking if we have a uid from our firebase auth object and returns our lobby ui
   * if we do.
   * Otherwise we get redirected to the sign in page.
   */
  if (auth.uid != null) {
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
            <Room room={room} />
          ) : (
            <Fragment>
              {" "}
              <Typography
                className={classes.lobbyTitle}
                variant={"h2"}
                component={"h3"}
              >
                Welcome to the lobby
              </Typography>
              <Typography
                className={classes.lobbyTitle}
                paragraph
                variant={"subtitle1"}
              >
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
  } else {
    return <Redirect to={"/"} />;
  }
};

export default Lobby;
