import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import CodeStorageContext, { defaultCodeStorageContext } from "./context/code-storage-context";
import { Theme } from "./types";

const root = document.createElement("div");
root.id = "app-root";

document.body.appendChild(root);

ReactDOM.render(
    <CodeStorageContext.Provider value={defaultCodeStorageContext}>
        <App />
    </CodeStorageContext.Provider>
    , root);

declare global {
    interface Window {
        board: any;
    }
}

declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}