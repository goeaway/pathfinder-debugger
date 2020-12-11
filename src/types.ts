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