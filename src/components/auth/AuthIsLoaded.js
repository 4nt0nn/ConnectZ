import React from "react";
import { useSelector } from "react-redux";
import { isLoaded } from "react-redux-firebase";
import LinearProgress from "@material-ui/core/LinearProgress";

/**
 * Functional component to check if auth state
 * is loaded, if not it will return a loading screen
 * otherwise it will return the child components.
 *
 * @param {object} param0 - child components.
 */
const AuthIsLoaded = ({ children }) => {
  const auth = useSelector((state) => state.firebase.auth);
  if (!isLoaded(auth)) return <LinearProgress />;
  return children;
};

export default AuthIsLoaded;
