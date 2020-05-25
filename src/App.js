import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthIsLoaded from "./components/auth/AuthIsLoaded";
import Router from "./components/router";

function App() {
  return (
    <BrowserRouter>
      <AuthIsLoaded>
        <div className={"App"}>
          <Router />
        </div>
      </AuthIsLoaded>
    </BrowserRouter>
  );
}

export default App;
