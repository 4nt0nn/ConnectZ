import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { getFirebase } from "react-redux-firebase";
import { getFirestore } from "redux-firestore";

import rootReducer from "../store/reducers/root";

/**
 * Configuration function for handling all
 * configurations to the createStore method.
 *
 * Split from index.js for better maintainability.
 *
 * Applying thunk as middleware in order to halt
 * the dispatch from action creators which will
 * let us fetch data and dispatch actions in callbacks.
 *
 * @param {object} preloadedState - Added in case we need to add
 * a preloaded state later.
 */
export default function storeConfig(preloadedState) {
  /**
   * Passing extra arguments to middleware in order to use getFirebase/getFirestore
   * in our action creators to communicate with firebase/firestore.
   */
  const middlewares = [
    thunkMiddleware.withExtraArgument({ getFirebase, getFirestore }),
  ];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  return store;
}
