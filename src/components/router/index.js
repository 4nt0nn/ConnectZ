import React from "react";
import { Switch, Route } from "react-router-dom";
import SignIn from "../auth/SignIn";
import Lobby from "../view/Lobby";

const Router = () => {
  return (
    <Switch>
      <Route exact path={"/"} component={SignIn} />
      <Route exact path={"/lobby"} component={Lobby} />
    </Switch>
  );
};

export default Router;
