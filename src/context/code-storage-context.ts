import algorithms from "@src/algorithms";
import { BoardState, CodeStorageService, EditableAlgo } from "@src/types";
import { createContext } from "react";

export const defaultCodeStorageContext : CodeStorageService = {
    getCode: () => {
        const raw = window.localStorage.getItem("code");

        if(raw) { // if found, combine saved code with rest of algo info
            const savedAlgo = JSON.parse(raw) as { id: string, code: string };
            const foundAlgo = algorithms.find(a => a.id === savedAlgo.id);
            return {...foundAlgo, code: savedAlgo.code };
        } else {
            // return the default choice
            return {...algorithms[0], code: algorithms[0].source};
        }
    },
    saveCode: (algo: EditableAlgo) => {
        window.localStorage.setItem("code", JSON.stringify({id: algo.id, code: algo.code}));
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