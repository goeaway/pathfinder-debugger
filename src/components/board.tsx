import { BoardState, Cell, Cells, CellType, Pos } from "@src/types";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import styled from "styled-components";
import DisplayCell from "./display-cell";

export interface BoardProps {
    onBoardStateChange: (newState: BoardState) => void;
    boardState: BoardState;
    canEdit: boolean;
}

const createCell = (row: number, column: number, boardState: BoardState) : Cell => {
    const { start, end, walls, checked, shortestPath } = boardState;

    return {
        type: start?.x === column && start?.y === row ? "start" :
              end?.x === column && end?.y === row ? "end" :
              walls.some(w => w.x === column && w.y === row) ? "wall" : 
              null,
        checkCount: checked.find(c => c.pos.x === column && c.pos.y === row)?.count,
        shortestPath: shortestPath.some(sp => sp.x === column && sp.y === row)
    }
}

const Board: React.FC<BoardProps> = ({ boardState, onBoardStateChange, canEdit }) => { 
    const [selectedPos, setSelectedPos] = useState<Pos>(null);
    const outerContainerRef = useRef<HTMLDivElement>();
    const [cellSize, setCellSize] = useState(0);
    const [onClickSetType, setOnClickSetType] = useState<CellType>("start");

    const actionHandler = (type: CellType, actionPos: Pos, actionState: BoardState, actionStateChange: (newState: BoardState) => void) => {
        switch(type) {
            case "start": {
                actionState.start = actionPos;
                actionStateChange(actionState);
                break;
            }
            case "wall": {
                // find pos in state.walls
                const existingWallIndex = actionState.walls.findIndex(w => w.x == actionPos.x && w.y == actionPos.y);
                
                // if it's there remove it, if not add it
                if(existingWallIndex > -1) {
                    actionState.walls.splice(existingWallIndex, 1);
                } else {
                    actionState.walls.push(actionPos);
                }
                actionStateChange(actionState);
                break;
            }
            case "end": {
                actionState.end = actionPos;
                actionStateChange(actionState);
                break;
            }
            case "weight": {
                break;
            }
        }
    }

    useEffect(() => {
        // handle key presses for arrow keys to update the selected cell
        const arrowPressHandler = ({key}: KeyboardEvent) => {
            const watchedKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

            // don't continue if the key press isn't for one of the above
            if(!watchedKeys.includes(key)) {
                return;
            }

            let xChange = 0;
            let yChange = 0;

            if(!selectedPos) {
                setSelectedPos({x: 0, y: 0});
            }

            // figure out how much to change the index pos of the current selectedCell
            // if selected cell is null we'll set to 0,0 
            switch(key) {
                case "ArrowUp": 
                    yChange = -1;
                    break;
                case "ArrowDown":
                    yChange = 1;
                    break;
                case "ArrowLeft":
                    xChange = -1;
                    break;
                case "ArrowRight":
                    xChange = 1;
                    break;
            }

            // get raw change, we handle array under/overflow below
            const rawX = selectedPos.x + xChange;
            const rawY = selectedPos.y + yChange;

            const fixedX = rawX < 0 
                ? boardState.columns - 1
                : rawX > boardState.columns - 1 
                    ? 0 : rawX;
            const fixedY = rawY < 0
                ? boardState.rows - 1
                : rawY > boardState.rows - 1
                    ? 0 : rawY;

            setSelectedPos({x: fixedX, y: fixedY});
        };

        // handle key presses for certain keys to peform actions
        const actionPressHandler = ({key}: KeyboardEvent) => {
            const handledKeys = ["s", "w", "e", "q"];
            // only do things if there is a selected cell or the key is in the above
            if(!selectedPos || !handledKeys.includes(key) || !canEdit) {
                return;
            }

            let type : CellType = "start";

            switch(key) {
                case "s":
                    break;
                case "e":
                    type = "end";
                    break;
                case "w":
                    type = "wall";
                    break;
                case "q":
                    break;
            }

            const copy = Object.assign({}, boardState);
            actionHandler(type, selectedPos, copy, onBoardStateChange);
        };

        window.addEventListener("keydown", arrowPressHandler);
        window.addEventListener("keydown", actionPressHandler);

        return () => {
            window.removeEventListener("keydown", arrowPressHandler);
            window.removeEventListener("keydown", actionPressHandler);
        }
    }, [selectedPos, boardState, canEdit]);

    useLayoutEffect(() => {
        const cellSizeHandler = () => {
            // get smallest of height and width of board container
            // divide that by the amount of cells we have in that dimension
            // set cellSize to be that calc
            if(outerContainerRef.current) {
                const { height, width } = outerContainerRef.current.getBoundingClientRect();

                const outerContainerStyle = getComputedStyle(outerContainerRef.current);
                const paddingHorizontal = parseFloat(outerContainerStyle.paddingLeft) + parseFloat(outerContainerStyle.paddingRight);
                const paddingVertical = parseFloat(outerContainerStyle.paddingTop) + parseFloat(outerContainerStyle.paddingBottom);

                const maxCellWidth = Math.floor((width - paddingHorizontal) / boardState.columns);
                const maxCellHeight = Math.floor((height - paddingVertical) / boardState.rows);

                const newCellSize = Math.min(maxCellHeight, maxCellWidth);
                setCellSize(newCellSize);
            }
        }

        cellSizeHandler();

        window.addEventListener("resize", cellSizeHandler);

        return () => {
            window.removeEventListener("resize", cellSizeHandler);
        }
    }, []);
    
    const onCellEnter = (pos: Pos) => {
        setSelectedPos(pos);
    }

    const onCellLeave = () => {
        setSelectedPos(null);
    }

    const onCellClick = (pos: Pos) => {
        if(onClickSetType && canEdit) {
            const copy = Object.assign({}, boardState);
            actionHandler(onClickSetType, pos, copy, onBoardStateChange);
        }
    }

    const onTypeChangeClick = () => {
        switch(onClickSetType) {
            case "start":
                setOnClickSetType("end");
                break;
            case "end":
                setOnClickSetType("wall");
                break;
            case "wall":
                setOnClickSetType("start");
        }
    }

    const onClearClick = () => {
        const newState = Object.assign({}, boardState);
        newState.checked = [];
        newState.shortestPath = [];
        newState.start = null;
        newState.end = null;
        newState.walls = [];
        newState.weights = [];
        onBoardStateChange(newState);
    }

    return (
        <OuterContainer ref={outerContainerRef}>
            <BoardContainer role="board">
                {boardState.rows.enumerate(row => (
                    <CellRow>
                        {boardState.columns.enumerate(col => (
                            <DisplayCell 
                            size={cellSize}
                            cell={createCell(row, col, boardState)}
                            onMouseEnter={() => onCellEnter({x: col, y: row})}
                            onMouseLeave={onCellLeave}
                                onClick={() => onCellClick({x: col, y: row})}
                                selected={selectedPos && col === selectedPos.x && row === selectedPos.y} 
                                key={`${col},${row}`} />
                                ))}
                    </CellRow>
                ))}
            </BoardContainer>
            {/* <Controls>
                <button type="button" onClick={onTypeChangeClick}>{onClickSetType}</button>
                <button type="button" onClick={onClearClick}>Clear</button>
            </Controls> */}
        </OuterContainer>
    );
}

export default Board;

const OuterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
    overflow: hidden;
`

const Controls = styled.div`
    padding: .5rem;
`

const BoardContainer = styled.div`
    display: inline-block;
`

const CellRow = styled.div`
    display: flex;
    justify-content: center;

    &:first-child > * {
        border-top: 2px solid #1F2937;

        &:first-child {
            border-top-left-radius: 6px;
        }

        &:last-child {
            border-top-right-radius: 6px;
        }
    }

    &:last-child > * {
        border-bottom: 2px solid #1F2937;

        &:first-child {
            border-bottom-left-radius: 6px;
        }

        &:last-child {
            border-bottom-right-radius: 6px;
        }
    }

    & > *:first-child {
        border-left: 2px solid #1F2937;
    }

    & > *:last-child {
        border-right: 2px solid #1F2937;
    }
`