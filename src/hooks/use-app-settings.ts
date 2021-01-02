import AppSettingsContext from "@src/context/app-settings-context";
import { useContext } from "react";

const useAppSettings = () => useContext(AppSettingsContext);

export default useAppSettings;