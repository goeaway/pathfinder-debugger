export type Cells = Array<Array<Cell>>;

export type CellType = "start" | "end" | "wall" | "weight";

export interface Cell {
    type?: CellType;
    checkCount?: number;
    shortestPath?: boolean;
}

export interface CellUpdate {
    pos: Pos;
    checkCountUpdate: number;
}

export interface Pos {
    x: number;
    y: number;
}

export interface Algo {
    id: string;
    name: string;
    source: string;
}

export interface RunSettings {
    x: number;
    y: number;
    start: Pos;
    end: Pos;
    walls: Array<Pos>;
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