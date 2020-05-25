import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

/**
 * Root reducer.
 */
export default combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});
