import React from "react";
import ReactDOM from "react-dom";
import App from "./components/app";
import AppSettingsContext, { defaultAppSettingsContext } from "./context/app-settings-context";
import CodeStorageContext, { defaultCodeStorageContext } from "./context/code-storage-context";
import { Theme } from "./types";

declare global {
    interface Window {
        board: any;
    }
    interface Number {
        enumerate<T>(enumerator: (index: number) => T): Array<T>;
    }
}

declare module "styled-components" {
    export interface DefaultTheme extends Theme {}
}

Number.prototype.enumerate = function<T>(enumerator: (index: number) => T) : Array<T> {
    if(this == null) {
        throw "value was null";
    }

    if(this < 0) {
        throw "Value was less than 0. Value must be 0 or greater to enumerate";
    }

    const data = [];
    for(let i = 0; i < this; i++) {
        data.push(enumerator(i));
    }
    return data;
}

const root = document.createElement("div");
root.id = "app-root";

document.body.appendChild(root);

ReactDOM.render(
    <CodeStorageContext.Provider value={defaultCodeStorageContext}>
        <AppSettingsContext.Provider value={defaultAppSettingsContext}>
            <App />
        </AppSettingsContext.Provider>
    </CodeStorageContext.Provider>
    , root);