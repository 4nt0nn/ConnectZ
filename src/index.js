import React, { StrictMode } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import storeConfig from "./config/storeConfig";
import firebaseConfig from "./config/firebaseConfig";

// Create and initialize a new store from our config file.
const store = storeConfig();

// React redux firebase config object that enables
// setting user profiles from cloud firestores user collection.
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};

// React redux firebase properties containing our
// firebase configuration file and extra config from our
// configuration object above, it also specifiec that
// the dispatch to be used is taken from our created store.
// Lastly initilize a new firestore instance for our application.
const rrfProps = {
  firebase: firebaseConfig,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

render(
  <StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <App />
      </ReactReduxFirebaseProvider>
    </Provider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
