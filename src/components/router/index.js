import React from "react";
import { Switch, Route } from "react-router-dom";
import SignIn from "../auth/SignIn";

const Router = () => {
  return (
    <Switch>
      <Route exact path={"/"} component={SignIn} />
      <Route exact path={"/lobby"} component={null} />
      <Route exact path={"/lobby/rooms/room/:id"} component={null} />
    </Switch>
  );
};

export default Router;
