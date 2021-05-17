import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import "firebase/app";
import "firebase/analytics";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

var firebaseConfig = {
  /**
   *
   */
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();