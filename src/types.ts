import { MutableRefObject } from "react";

export type Cells = Array<Array<Cell>>;

export type CellType = "start" | "end" | "wall" | "weight";

export interface Cell {
    type?: CellType;
    checkCount?: number;
    shortestPath?: boolean;
    pos?: Pos;
    weight?: number;
}

export interface BoardState {
    start: Pos;
    end: Pos;
    walls: Array<Pos>;
    weights: Array<PosAndWeight>;
    rows: number;
    columns: number;
    checked: Array<{pos: Pos, count: number}>;
    shortestPath: Array<Pos>;
}

export interface PosAndNeighbours {
    pos: Pos;
    neighbours: Array<PosAndWeight>;
}

export interface Graph {
    [key: string]: PosAndNeighbours;
}

export interface RunSettings { 
    graph: Graph;
    start: Pos;
    end: Pos;
}

export interface Pos {
    x: number;
    y: number;
}

export interface PosAndWeight {
    pos: Pos;
    weight: number;
}

export type AlgoType = "custom" | "weighted" | "unweighted";

export interface Algo {
    id: string;
    name: string;
    source: string;
    type: AlgoType;
}

export interface EditableAlgo extends Algo {
    code: string;
}

export interface Theme {
    background: Range;
    fontLight: Range;
    fontDark: Range;
    heroSrc: string;
    breakpoints: Breakpoints;
}

export interface Range {
    one: string;
    two?: string;
    three?: string;
    four?: string;
    five?: string;
}

export interface Breakpoints {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
}

export interface CodeStorageService {
    getCode: () => EditableAlgo;
    saveCode: (code: EditableAlgo) => void;
    getBoardState: () => BoardState;
    saveBoardState: (boardState: BoardState) => void;
}

export type PopoverPosition = "bottom" | "bottomright" | "bottomleft";

export interface AppSettings {
    percentWalls: number;
    percentWeights: number;
}

export interface AppSettingsService {
    getAppSettings: () => AppSettings;
    saveAppSettings: (settings: AppSettings) => void;
}

export interface TooltipContext {
    showTooltip: (
        handle: MutableRefObject<HTMLElement>, 
        content: any, 
        options?: TooltipOptions) => void;
    hideTooltip: (handle: MutableRefObject<HTMLElement>) => void;
}

export interface TooltipOptions {
    showDelay?: number;
    offsetCalculator?: (tooltipWidth: number, tooltipNumber: number) => ElementOffset;
}

export interface ElementOffset {
    top: number;
    left: number;
}