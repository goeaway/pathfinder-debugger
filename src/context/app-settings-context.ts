import { createContext } from "react";
import { AppSettings, AppSettingsService } from "@src/types";

export const defaultAppSettingsContext : AppSettingsService = {
    getAppSettings: () => {
        const raw = window.localStorage.getItem("appsettings");
        return raw ? JSON.parse(raw) : {
            updateSpeed: 25,
            percentWalls: 30,
            percentWeights: 20,
        }
    },
    saveAppSettings: (settings: AppSettings) => {
        window.localStorage.setItem("appsettings", JSON.stringify(settings));
    }
}

const AppSettingsContext = createContext<AppSettingsService>(defaultAppSettingsContext);

export default AppSettingsContext;