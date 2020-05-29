import React from "react";
import { Switch, Route } from "react-router-dom";
import SignIn from "../auth/SignIn";
import Lobby from "../view/Lobby";

/**
 * Functional component for creating our
 * router and declaring what routes leads to what components.
 */
const Router = () => {
  return (
    <Switch>
      <Route exact path={"/"} component={SignIn} />
      <Route exact path={"/lobby"} component={Lobby} />
    </Switch>
  );
};

export default Router;
