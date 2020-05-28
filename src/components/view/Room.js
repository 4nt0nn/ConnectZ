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

const Room = (props) => {
  const [message, setMessage] = useState("");
  const [video, setVideo] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const firebase = useFirebase();
  const events = useSelector((state) => state.firestore.ordered.events);
  const users = useSelector((state) => state.firestore.ordered.users);
  const auth = useSelector((state) => state.firebase.auth);

  useFirestoreConnect([
    {
      collection: "rooms",
      doc: props.room.id,
      subcollections: [{ collection: "events" }],
      storeAs: "events",
    },
  ]);

  useFirestoreConnect(() => [{ collection: "users" }]);

  const boundAddMessage = () =>
    dispatch(tryToSendMessage(firebase, firestore, message, props.room.id));

  const handleChange = (prop) => (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    boundAddMessage();
    setMessage("");
  };

  const handleFileUpload = () => {
    console.log("This should open a file selection window");
  };

  const handleNewVideoSession = () => {
    setVideo(!video);
  };

  const handleUserList = () => {
    console.log("This should open a list of the users in the room");
  };

  const getUserAndMessage = (message) => {
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
                        {users ? getUserAndMessage(message) : ""}
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
