import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk";

import { Typography, Grid, ButtonGroup, Fab, Avatar } from "@material-ui/core";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import CloseIcon from "@material-ui/icons/Close";

/**
 * Function assignment to make styles which
 * returns our styles object.
 */
const useStyles = makeStyles((theme) => ({
  videoWindow: {
    color: "#ffffff",
    width: "420px",
    height: "45vh",
    backgroundColor: "#000000",
    position: "absolute",
    top: 80,
    right: 10,
    borderRadius: 10,
    border: "2px solid #3f51b5",
    padding: 5,
  },
  fullScreenVideo: {
    color: "#ffffff",
    backgroundColor: "#000000",
    position: "absolute",
    top: 80,
    zIndex: 99,
    right: 10,
    bottom: 10,
    left: 250,
    borderRadius: 10,
    padding: 10,
  },
  margin: {
    margin: theme.spacing(1),
  },
  videoContainerGrid: {
    height: "100%",
  },
  localVideo: {
    height: 120,
    width: 120,
    position: "absolute",
    right: 5,
    top: 5,
    borderRadius: 5,
  },
  sessionOptions: {
    position: "absolute",
    bottom: 5,
  },
  noVideoAvatar: {
    height: 90,
    width: 90,
    margin: "auto",
  },
}));

/**
 * Real time communication object that
 * will hold our client, localstream, params
 * and remote streams
 */
let rtc = {
  client: null,
  joined: false,
  published: false,
  localStream: null,
  remoteStreams: [],
  params: {},
};

/**
 * Functional component responsible for rendering our video chat ui
 * and handling the logic regarding the agora sdk such as
 * creating a new client and stream as well as listening to events
 * on the instantiated client.
 *
 * @param {object} props - Containing our users object passed from the room component.
 */
const Video = (props) => {
  const classes = useStyles(); // variable holding our styles object.
  const auth = useSelector((state) => state.firebase.auth); // variable holding our auth object from the firebase state
  const profile = useSelector((state) => state.firebase.profile); // variable holding our profile object from the firebase state
  const [hasVideo, setHasVideo] = useState(false); // Bool state to check if the user has a device with video supported, used to render different components
  const [start, setStart] = useState(false); // Bool state to check if the user has chosen to start the video session or not.
  const [fullScreen, setFullScreen] = useState(false); // Bool state to change the style of our video component to "full screen" or back from it.

  /**
   * Object holding all of our agora
   * credentials as well as our auth.uid
   * from firebase.
   */
  const option = {
    appID: process.env.REACT_APP_AGORA_APP_ID,
    channel: process.env.REACT_APP_AGORA_CHANNEL_NAME,
    uid: auth.uid,
    token: process.env.REACT_APP_AGORA_TOKEN,
  };

  /**
   * Arrow function that creates the client
   * and fires all functions responsible for
   * adding event listeners on the client
   */
  const handleInitialization = () => {
    setStart(!start);
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });
    rtc.client.init(
      option.appID,
      () => {
        console.log("init successfull!");
        handleJoiningChannel();
        handleStreamAdded();
        handleStreamSubscription();
        handleStreamRemoved();
        props.handleSubmit();
      },
      (err) => console.log("Error when initializing the channel: ", err)
    );
  };

  /**
   * Arrow function that is responsible
   * for handling the joining of a channel
   * on the client. As well as fireing
   * the function that handles our local stream.
   */
  const handleJoiningChannel = () => {
    rtc.client.join(
      option.token,
      option.channel,
      auth.uid,
      (uid) => {
        rtc.params = { ...rtc.params, uid: uid };
        handleLocalStream();
      },
      (err) => {
        console.log("Error when joining the channel: ", err);
      }
    );
  };

  /**
   * Arrow function responsible for the
   * logic arround leaving the channel. Including
   * stopping and closing our local stream
   */
  const handleLeavingChannel = () => {
    rtc.client.leave(
      () => {
        rtc.localStream.stop();
        rtc.localStream.close();
        while (rtc.remoteStreams.length > 0) {
          let stream = rtc.remoteStreams.shift();
          let id = stream.getId();
          stream.stop();
          rtc.remoteStreams = rtc.remoteStreams.filter(
            (stream) => stream.getId() !== id
          );
        }
        props.handleClosingVideo();
      },
      (err) => {
        console.log("Error when leaving the channel: ", err);
      }
    );
  };

  /**
   * Arrow function that handles the creation
   * and initialization of our local stream.
   */
  const handleLocalStream = () => {
    rtc.localStream = AgoraRTC.createStream({
      streamID: rtc.params.uid,
      audio: true,
      video: true,
      screen: false,
    });
    rtc.localStream.init(
      () => {
        console.log("Local stream initialized!");
        rtc.localStream.play("local_stream", { fit: "cover" });
        handleStreamPublication(rtc.localStream);
        let video = rtc.localStream.getVideoTrack();
        let audio = rtc.localStream.getAudioTrack();
        if (video === undefined) {
          rtc.localStream.disableVideo();
          setHasVideo(false);
          console.log("Video connection failed");
        }
        if (audio === undefined) {
          rtc.localStream.disableAudio();
          console.log("Audio connection failed");
        }
      },
      (err) => {
        console.log("Error when initializing the stream: ", err);
      }
    );
  };

  /**
   * Arrow function that publishes our
   * local stream to the client.
   */
  const handleStreamPublication = () => {
    rtc.client.publish(rtc.localStream, (err) => {
      console.log("Error when publishing the local stream: ", err);
    });
  };

  /**
   * Arrow function responsible for
   * setting the event listener/handler
   * of the "stream-added" event on the client.
   */
  const handleStreamAdded = () => {
    rtc.client.on("stream-added", (evt) => {
      let remoteStream = evt.stream;
      let id = remoteStream.getId();
      if (id !== rtc.params.uid) {
        rtc.client.subscribe(remoteStream, (err) => {
          console.log("Failed to subscribe to remote stream: ", err);
        });
      }
    });
  };

  /**
   * Arrow function responsible for setting
   * the event listener/handler of the "stream-subscribed"
   * event on the client
   */
  const handleStreamSubscription = () => {
    rtc.client.on("stream-subscribed", (evt) => {
      let remoteStream = evt.stream;
      let id = remoteStream.getId();

      rtc.remoteStreams = [...rtc.remoteStreams, remoteStream];

      remoteStream.play("remote_stream_", id);
    });
  };

  /**
   * Arrow function responsible for setting
   * the event listener/handler of the "stream-removed"
   * event on the client
   */
  const handleStreamRemoved = () => {
    rtc.client.on("stream-removed", (evt) => {
      let remoteStream = evt.stream;
      let id = remoteStream.getId();
      remoteStream.stop("remote_stream_", id);
      rtc.remoteStreams = rtc.remoteStreams.filter(
        (stream) => stream.getId() !== id
      );
    });
  };

  /**
   * Arrow function that sets/toggles the
   * fullscreen state
   */
  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <div className={fullScreen ? classes.fullScreenVideo : classes.videoWindow}>
      {start ? (
        <Grid
          className={classes.videoContainerGrid}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <div id={"local_stream"} className={classes.localVideo}>
            {hasVideo ? (
              ""
            ) : (
              <Avatar
                className={classes.noVideoAvatar}
                alt={profile.name}
                src={profile.imageUrl}
              />
            )}
          </div>
          {rtc.remoteStreams.map((stream) => (
            <div
              key={stream.getId()}
              id={`remote_stream_${stream.getId()}`}
              className={classes.remoteVideo}
            />
          ))}
          {rtc.remoteStreams.length <= 0 ? (
            <Typography component={"p"} variant={"caption"}>
              There is no one else in the video session
            </Typography>
          ) : (
            ""
          )}
          <ButtonGroup
            className={classes.sessionOptions}
            variant="contained"
            aria-label="contained primary button group"
            disableElevation
          >
            <Fab
              size="medium"
              color="secondary"
              aria-label="cancel"
              className={classes.margin}
              onClick={handleLeavingChannel}
            >
              <CloseIcon />
            </Fab>{" "}
            <Fab
              size="medium"
              color="primary"
              aria-label="full-screen"
              className={classes.margin}
              onClick={toggleFullScreen}
            >
              {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </Fab>
          </ButtonGroup>
        </Grid>
      ) : (
        <Grid
          className={classes.videoContainerGrid}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Typography
            className={classes.videoTitle}
            component={"h6"}
            variant={"h6"}
          >
            Do you want to join the video session?
          </Typography>
          <ButtonGroup
            variant="contained"
            aria-label="contained primary button group"
            disableElevation
          >
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="join"
              className={classes.margin}
              onClick={handleInitialization}
            >
              Join
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="secondary"
              aria-label="cancel"
              className={classes.margin}
              onClick={props.handleCancel}
            >
              Cancel
            </Fab>
          </ButtonGroup>
        </Grid>
      )}
    </div>
  );
};

export default Video;
