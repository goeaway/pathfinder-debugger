import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";

const root = document.createElement("div");
root.id = "app-root";

document.body.appendChild(root);

ReactDOM.render(<App />, root);

declare global {
    interface Window {
        board: any;
    }
}