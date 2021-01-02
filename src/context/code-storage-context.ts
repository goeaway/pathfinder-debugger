import { Algo, BoardState, Cells, CodeStorageService, EditableAlgo } from "@src/types";
import { createContext } from "react";

export const defaultCodeStorageContext : CodeStorageService = {
    getCode: () => {
        const raw = window.localStorage.getItem("code");
        return JSON.parse(raw) as EditableAlgo;
    },
    saveCode: (algo: EditableAlgo) => {
        window.localStorage.setItem("code", JSON.stringify(algo));
    },
    getBoardState: () => {
        const raw = window.localStorage.getItem("boardState");
        return JSON.parse(raw) as BoardState;
    },
    saveBoardState: (boardState: BoardState) => {
        window.localStorage.setItem("boardState", JSON.stringify(boardState));
    }
}

const CodeStorageContext = createContext<CodeStorageService>(defaultCodeStorageContext);

export default CodeStorageContext;