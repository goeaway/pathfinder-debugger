import { Algo, Cells, CodeStorageService } from "@src/types";
import { createContext } from "react";

export const defaultCodeStorageContext : CodeStorageService = {
    getCode: () => {
        const raw = window.localStorage.getItem("code");
        return JSON.parse(raw) as { code: string, algo: Algo };
    },
    saveCode: (code: { code: string, algo: Algo }) => {
        window.localStorage.setItem("code", JSON.stringify(code));
    },
    getGrid: () => {
        const raw = window.localStorage.getItem("grid");
        return JSON.parse(raw) as Cells;
    },
    saveGrid: (grid: Cells) => {
        window.localStorage.setItem("grid", JSON.stringify(grid));
    }
}

const CodeStorageContext = createContext<CodeStorageService>(defaultCodeStorageContext);

export default CodeStorageContext;