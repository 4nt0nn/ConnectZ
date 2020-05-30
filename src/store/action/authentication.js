import * as Types from "./types";

/**
 * Action creator for authentication with firebase.
 * @param {object} firebase - containing our instance of firebase with api methods.
 * @param {object} credentials - containing the users email and password
 */
export const tryToAuthenticate = (firebase, credentials) => {
  return (dispatch, getState) => {
    dispatch({ type: Types.TRY_TO_SIGN_IN });
    firebase
      .login({ email: credentials.email, password: credentials.password })
      .then(() => dispatch({ type: Types.SUCCEDED_TO_SIGN_IN }))
      .catch((err) => dispatch({ type: Types.FAILED_TO_SIGN_IN }));
  };
};

/**
 * Action creator for signing out the user.
 * @param {object} firebase - containing our instance of firebase with api methods.
 */
export const tryToSignOut = (firebase) => {
  return (dispatch, getState) => {
    dispatch({ type: Types.TRY_TO_SIGN_OUT });
    firebase
      .logout()
      .then(() => dispatch({ type: Types.SUCCEDED_TO_SIGN_OUT }))
      .catch((err) => dispatch({ type: Types.FAILED_TO_SIGN_OUT }));
  };
};
