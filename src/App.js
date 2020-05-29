import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthIsLoaded from "./components/auth/AuthIsLoaded";
import Router from "./components/router";

/**
 * Root application component holding
 * our browser router that wraps our
 * AuthIsLoaded component checking our auth state,
 * AuthIsLoaded wraps our application component
 * containing our roter.
 */
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
