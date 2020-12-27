import { Algo, BoardState, Cells, CodeStorageService } from "@src/types";
import { createContext } from "react";

export const defaultCodeStorageContext : CodeStorageService = {
    getCode: () => {
        const raw = window.localStorage.getItem("code");
        return JSON.parse(raw) as { code: string, algo: Algo };
    },
    saveCode: (code: { code: string, algo: Algo }) => {
        window.localStorage.setItem("code", JSON.stringify(code));
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