export type Cells = Array<Array<Cell>>;

export type CellType = "start" | "end" | "wall" | "weight";

export interface Cell {
    type?: CellType;
    checkCount?: number;
    shortestPath?: boolean;
}

export interface BoardState {
    start: Pos;
    end: Pos;
    walls: Array<Pos>;
    weights: Array<Pos>;
    rows: number;
    columns: number;
    checked: Array<{pos: Pos, count: number}>;
    shortestPath: Array<Pos>;
}

export type RunSettings = Pick<BoardState, "start" | "end" | "walls" | "rows" | "columns">;

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
    getCode: () => { algo: Algo, code: string };
    saveCode: (code: {algo: Algo, code: string}) => void;
    getBoardState: () => BoardState;
    saveBoardState: (boardState: BoardState) => void;
}