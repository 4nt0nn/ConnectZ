import React from "react";
import AuthIsLoaded from "./components/auth/AuthIsLoaded";
import SignIn from "./components/auth/SignIn";

function App() {
  return (
    <AuthIsLoaded>
      <div className={"App"}>
        <SignIn />
      </div>
    </AuthIsLoaded>
  );
}

export default App;
