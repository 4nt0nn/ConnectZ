import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  Typography,
  Input,
  InputAdornment,
  Paper,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import { useDispatch, useSelector } from "react-redux";
import { tryToAuthenticate } from "../../store/action/authentication";
import { useFirebase } from "react-redux-firebase";
import { Redirect } from "react-router";

/**
 * Styling variable which calls a function
 * makeStyles that returns a object with
 * js syntax styling.
 */
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",

    "& > *": {
      margin: theme.spacing(10),
    },
  },
  margin: {
    margin: theme.spacing(3),
  },
  signInForm: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: theme.spacing(50),
    height: theme.spacing(40),
  },
}));

/**
 * Functional component used to display the
 * sign in form and handle the logic regarding
 * entering credentials and dispatching the "tryToAuthenticate" actions.
 */
const SignIn = () => {
  const classes = useStyles(); // Variable containing our styles object.
  const [credentials, setCredentials] = useState({}); // credentials state that will hold the information the user types in the form.
  const dispatch = useDispatch(); // Function used to dispatch actions.
  const firebase = useFirebase(); // Variable containing our firebase instance.
  const auth = useSelector((state) => state.firebase.auth); // Variable containing our auth state object.

  /**
   * Arrow function that is used to bind our dispatch function
   * for trying to authenticate.
   */
  const boundSignInHandler = () =>
    dispatch(tryToAuthenticate(firebase, credentials));

  /**
   * Arrow function for handling changes to our form.
   * @param {object} e - Containing our event object.
   */
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.id]: e.target.value });
  };

  /**
   * Arrow function for handling submission of our form.
   * @param {object} e - Containing our event object.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    boundSignInHandler();
  };
  if (auth.uid != null) return <Redirect to={"/lobby"} />;
  return (
    <div className={classes.root}>
      <Paper elevation={3}>
        <Grid
          container
          direction={"column"}
          justify={"center"}
          alignItems={"center"}
        >
          <Typography
            className={classes.margin}
            variant={"h3"}
            component={"h3"}
          >
            Sign In
          </Typography>
          <Typography
            className={classes.margin}
            variant={"caption"}
            component={"p"}
          >
            You have to get an invite from a member in order to sign in.
          </Typography>
          <form onSubmit={handleSubmit} className={classes.signInForm}>
            <FormControl className={classes.margin}>
              <InputLabel htmlFor={"email"}>Email</InputLabel>
              <Input
                type={"text"}
                id={"email"}
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position={"start"}>
                    <AccountCircle />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl className={classes.margin}>
              <InputLabel htmlFor={"password"}>Password</InputLabel>
              <Input
                type={"password"}
                id={"password"}
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position={"start"}>
                    <LockIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              className={classes.margin}
              type={"submit"}
              variant={"contained"}
              color={"primary"}
            >
              Submit
            </Button>
          </form>
        </Grid>
      </Paper>
    </div>
  );
};

export default SignIn;
