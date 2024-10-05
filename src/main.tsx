import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css"; // Import Amplify UI styles
import App from "./App";
import "./index.css";

function Root() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <App signOut={signOut} user={user} />
        </main>
      )}
    </Authenticator>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);