import CodeStorageContext from "@src/context/code-storage-context";
import { CodeStorageService } from "@src/types";
import { useContext } from "react";

export const useCodeStorage = () => useContext<CodeStorageService>(CodeStorageContext);