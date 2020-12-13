import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import { Theme } from "./types";

const root = document.createElement("div");
root.id = "app-root";

document.body.appendChild(root);

ReactDOM.render(<App />, root);

declare global {
    interface Window {
        board: any;
    }
}

declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}