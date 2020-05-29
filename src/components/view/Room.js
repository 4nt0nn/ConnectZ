import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Divider,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  IconButton,
  Grid,
  Paper,
  Slide,
  Avatar,
  Fab,
  ButtonGroup,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import ChatIcon from "@material-ui/icons/Chat";
import VideocamIcon from "@material-ui/icons/Videocam";
import PeopleIcon from "@material-ui/icons/People";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { useSelector, useDispatch } from "react-redux";
import {
  useFirestoreConnect,
  useFirestore,
  useFirebase,
} from "react-redux-firebase";
import { tryToSendMessage } from "../../store/action/event";
import Video from "./Video";

/**
 * Styling variable which calls a function
 * makeStyles that returns a object with
 * js syntax styling.
 */
const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "15ch",
  },
  chatContainer: {
    height: "71vh",
    width: "60%",
    padding: theme.spacing(1),
    overflow: "hidden",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    msOverflowStyle: "none",
  },
  messageBubble: {
    color: "#ffffff",
    height: "auto",
    minWidth: 150,
    maxWidth: 300,
    padding: 15,
    margin: 10,
    textAlign: "center",
  },
  myMessageWrapper: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  otherMessageWrapper: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
    flexDirection: "row",
    alignItems: "center",
  },
  roomTitle: {
    textAlign: "center",
  },
}));

/**
 * Functional component for displaying our room ui and handling
 * logic arround chat and calls.
 * @param {object} props - Containing the selected room.
 */
const Room = (props) => {
  const [message, setMessage] = useState(""); // Message state varaible used for holding the text of the message.
  const [video, setVideo] = useState(false); // Video state variable used for toggling the video window.
  const classes = useStyles(); // variable containing our style object.
  const dispatch = useDispatch(); // variable containing the dispatch function
  const firestore = useFirestore(); // variable containing our instance of firestore.
  const firebase = useFirebase(); // variable containing our instance of frebase.
  const events = useSelector((state) => state.firestore.ordered.events); // variable containing our list of events for a specific room fetched from firestor.
  const users = useSelector((state) => state.firestore.ordered.users); // varaible containing our list of users fetched from firestore.
  const auth = useSelector((state) => state.firebase.auth); // variable containing our auth state object from firebase.

  /**
   * React hook that automatically listens/unListens to provided Cloud Firestore paths.
   * used in this context to fetch the events of a specific room.
   */
  useFirestoreConnect([
    {
      collection: process.env.REACT_APP_COLLECTION_TWO,
      doc: props.room.id,
      subcollections: [{ collection: process.env.REACT_APP_COLLECTION_THREE }],
      storeAs: process.env.REACT_APP_COLLECTION_THREE,
    },
  ]);

  /**
   * React hook that automatically listens/unListens to provided Cloud Firestore paths.
   * used in this context to fetch the users.
   */
  useFirestoreConnect(() => [
    { collection: process.env.REACT_APP_COLLECTION_ONE },
  ]);

  /**
   * Arrow function used to bind the dispatch of
   * the actions for trying to send a message.
   */
  const boundAddMessage = () =>
    dispatch(tryToSendMessage(firebase, firestore, message, props.room.id));

  /**
   * Arrow function that handles updating our message state variable.
   * @param {object} event - Containing the event of the message input field
   */
  const handleChange = (props) => (event) => {
    setMessage(event.target.value);
  };

  /**
   * Arrow function that handles the submission of the message.
   */
  const handleSubmit = () => {
    boundAddMessage();
    setMessage("");
  };

  /**
   * Arrow function for handling uploading a file
   * in the chat.
   */
  const handleFileUpload = () => {
    console.log("This should open a file selection window");
  };

  /**
   * Arrow function for opening or closing the videosession window.
   */
  const handleNewVideoSession = () => {
    setVideo(!video);
  };

  /**
   * Arrow function for handling the list of users and adding or removing a user
   * from the room.
   */
  const handleUserList = () => {
    props.handleModalOpen({
      id: "members",
      title: `Användare i #${props.room.title}`,
      itemList: users.filter(
        (user, index) => user.id === props.room.users[index]
      ),
      itemListSubheader: "You are alone in this room...",
      fields: [
        {
          id: "users",
          select: true,
          options: users.filter(
            (user, index) =>
              user.id !== auth.uid && user.id !== props.room.users[index]
          ),
        },
      ],
      buttons: [
        {
          text: "Lägg till",
          type: "submit",
          color: "primary",
          abort: false,
        },
        {
          text: "Stäng",
          type: "reset",
          color: "secondary",
          abort: true,
        },
      ],
    });
  };

  /**
   * Arrow function that handles returning the avatar of the user for
   * a specific message.
   * @param {object} message - Containing the message text, time and user.
   */
  const getUserOfMessage = (message) => {
    let user = users.find((user) => user.id === message.user);
    return <Avatar alt={user.name} src={user.imageUrl} />;
  };

  return (
    <Fragment>
      <Typography className={classes.roomTitle} variant={"h4"} component={"h6"}>
        # {props.room.title}
      </Typography>
      <Grid
        container
        direction={"column"}
        justify={"center"}
        alignItems={video ? "flex-start" : "center"}
      >
        <div className={classes.chatContainer}>
          {events &&
            events.map((event) =>
              event.id === "message"
                ? event.messages.map((message) => (
                    <Slide
                      key={message.sentAt}
                      direction={"up"}
                      in={true}
                      timeout={500}
                      unmountOnExit
                      mountOnEnter
                    >
                      <div
                        className={
                          message.user === auth.uid
                            ? classes.myMessageWrapper
                            : classes.otherMessageWrapper
                        }
                      >
                        {users ? getUserOfMessage(message) : ""}
                        <Paper
                          className={classes.messageBubble}
                          style={
                            message.user === auth.uid
                              ? {
                                  backgroundColor: "#3f51b5",
                                  marginLeft: "auto",
                                }
                              : {
                                  backgroundColor: "#212931",
                                  marginRight: "auto",
                                }
                          }
                          elevation={2}
                        >
                          {message.content}
                        </Paper>
                      </div>
                    </Slide>
                  ))
                : ""
            )}
        </div>
        <ButtonGroup
          variant="contained"
          aria-label="contained primary button group"
          disableElevation
        >
          <Fab
            size="medium"
            color="primary"
            aria-label="video"
            className={classes.margin}
            onClick={handleNewVideoSession}
          >
            <VideocamIcon />
          </Fab>
          <Fab
            size="medium"
            color="primary"
            aria-label="add"
            className={classes.margin}
            onClick={handleUserList}
          >
            <PeopleIcon />
          </Fab>
          <Fab
            size="medium"
            color="primary"
            aria-label="add"
            className={classes.margin}
            onClick={handleFileUpload}
          >
            <AddPhotoAlternateIcon />
          </Fab>
        </ButtonGroup>
        <FormControl fullWidth className={classes.margin} variant={"outlined"}>
          <InputLabel htmlFor={"message"}>Message</InputLabel>
          <OutlinedInput
            id={"message"}
            value={message}
            onChange={handleChange("message")}
            startAdornment={
              <InputAdornment position={"start"}>
                <ChatIcon />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position={"end"}>
                <IconButton
                  onClick={handleSubmit}
                  aria-label={"toggle password visibility"}
                  edge={"end"}
                  disabled={message !== "" ? false : true}
                  color={"primary"}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
            labelWidth={60}
          />
        </FormControl>
      </Grid>
      {video ? (
        <Video users={users} handleCancel={handleNewVideoSession} />
      ) : null}
    </Fragment>
  );
};

export default Room;
