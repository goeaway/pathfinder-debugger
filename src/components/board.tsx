import { faMapMarkerAlt, faRoute, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BoardState, Cell, Cells, CellType, Pos } from "@src/types";
import getTypeDescription from "@src/utils/get-type-description";
import getTypeIcon from "@src/utils/get-type-icon";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import styled from "styled-components";
import DisplayCell from "./display-cell";
import Tooltip from "./tooltip";

export interface BoardProps {
    onBoardStateChange: (newState: BoardState) => void;
    boardState: BoardState;
    canEdit: boolean;
    onCellClickType: CellType;
}

const createCell = (row: number, column: number, boardState: BoardState) : Cell => {
    const { start, end, walls, weights, checked, shortestPath } = boardState;

    return {
        type: start?.x === column && start?.y === row ? "start" :
              end?.x === column && end?.y === row ? "end" :
              walls.some(w => w.x === column && w.y === row) ? "wall" : 
              weights.some(w => w.x === column && w.y === row) ? "weight" :
              null,
        checkCount: checked.find(c => c.pos.x === column && c.pos.y === row)?.count,
        shortestPath: shortestPath.some(sp => sp.x === column && sp.y === row),
        pos: { y: row, x: column }
    }
}

const Board: React.FC<BoardProps> = ({ boardState, onBoardStateChange, canEdit, onCellClickType }) => { 
    const [cells, setCells] = useState<Cell[][]>([]);
    const [selectedCell, setSelectedCell] = useState<Cell>(null);
    const [cellSize, setCellSize] = useState(0);
    const outerContainerRef = useRef<HTMLDivElement>();

    useEffect(() => {
        const newCells = [];
        for(let row = 0; row < boardState.rows; row++) {
            const cellRow = [];
            for(let col = 0; col < boardState.columns; col++) {
                const cell = createCell(row, col, boardState);
                cellRow.push(cell);
                if(selectedCell && row === selectedCell.pos.y && col === selectedCell.pos.x) {
                    setSelectedCell(cell);
                }
            }
            newCells.push(cellRow);
        }
        setCells(newCells);
    }, [boardState]);

    const actionHandler = (type: CellType, actionPos: Pos, actionState: BoardState, actionStateChange: (newState: BoardState) => void) => {
        // remove pos from any existing board state to avoid the same position having multiple different types
        if(actionState.start.x === actionPos.x && actionState.start.y === actionPos.y) {
            actionState.start = null;
        }

        if(actionState.end.x === actionPos.x && actionState.end.y === actionPos.y) {
            actionState.end = null;
        }

        const existingWallIndex = actionState.walls.findIndex(w => w.x === actionPos.x && w.y === actionPos.y);
        if(existingWallIndex > -1) {
            actionState.walls.splice(existingWallIndex, 1);
        }

        const existingWeightIndex = actionState.weights.findIndex(w => w.x == actionPos.x && w.y == actionPos.y);
        if(existingWeightIndex > -1) {
            actionState.weights.splice(existingWeightIndex, 1);
        }

        switch(type) {
            case "start": {
                actionState.start = actionPos;
                actionStateChange(actionState);
                break;
            }
            case "wall": {
                // don't push if there was already a wall here
                if(existingWallIndex === -1) {
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
                // don't push if there was already a weight here
                if(existingWeightIndex === -1) {
                    actionState.weights.push(actionPos);
                }
                actionStateChange(actionState);
                break;
            }
        }
    }

    useEffect(() => {
        // handle key presses for arrow keys to update the selected cell
        const arrowPressHandler = ({key}: KeyboardEvent) => {
            const watchedKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

            // don't continue if the key press isn't for one of the above
            if(!watchedKeys.includes(key) || !canEdit) {
                return;
            }

            let xChange = 0;
            let yChange = 0;

            if(!selectedCell) {
                setSelectedCell(cells[0][0]);
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
            const rawX = selectedCell.pos.x + xChange;
            const rawY = selectedCell.pos.y + yChange;

            const fixedX = rawX < 0 
                ? boardState.columns - 1
                : rawX > boardState.columns - 1 
                    ? 0 : rawX;
            const fixedY = rawY < 0
                ? boardState.rows - 1
                : rawY > boardState.rows - 1
                    ? 0 : rawY;

            setSelectedCell(cells[fixedY][fixedX]);
        };

        // handle key presses for certain keys to peform actions
        const actionPressHandler = ({key}: KeyboardEvent) => {
            const handledKeys = ["s", "w", "e", "q"];
            // only do things if there is a selected cell or the key is in the above
            if(!selectedCell || !handledKeys.includes(key) || !canEdit) {
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
                    type = "weight";
                    break;
            }

            const copy = Object.assign({}, boardState);
            actionHandler(type, selectedCell.pos, copy, onBoardStateChange);
        };

        window.addEventListener("keydown", arrowPressHandler);
        window.addEventListener("keydown", actionPressHandler);

        return () => {
            window.removeEventListener("keydown", arrowPressHandler);
            window.removeEventListener("keydown", actionPressHandler);
        }
    }, [selectedCell, boardState, canEdit]);

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

                const maxCellWidth = (width - paddingHorizontal) / boardState.columns;
                const maxCellHeight = (height - paddingVertical) / boardState.rows;

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

    const onCellEnter = (cell: Cell) => {
        if(canEdit) {
            setSelectedCell(cell);
        }
    }

    const onCellLeave = () => {
        setSelectedCell(null);
    }

    const onCellClick = (pos: Pos) => {
        if(onCellClickType && canEdit) {
            const copy = Object.assign({}, boardState);
            actionHandler(onCellClickType, pos, copy, onBoardStateChange);
        }
    }

    return (
        <OuterContainer ref={outerContainerRef}>
            <Tooltip 
                show={!!selectedCell}
            >
                <TooltipContent>
                    <div>
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {selectedCell?.pos.x}, {selectedCell?.pos.y}
                    </div>
                    {selectedCell?.type && (
                        <div>
                            <FontAwesomeIcon icon={getTypeIcon(selectedCell.type)} /> {getTypeDescription(selectedCell.type)}
                        </div>
                    )}
                    {selectedCell?.checkCount && (
                        <div>
                            <FontAwesomeIcon icon={faSearch} /> Cell was checked {selectedCell?.checkCount} time{selectedCell.checkCount !== 1 ? "s" : ""}
                        </div>
                    )}
                    {selectedCell?.shortestPath && ["start", "end"].indexOf(selectedCell?.type) === -1 && selectedCell?.type !== "end" && (
                        <div>
                            <FontAwesomeIcon icon={faRoute} /> Cell is part of the shortest path
                        </div>
                    )}
                </TooltipContent>
            </Tooltip>
            <BoardContainer role="board">
                {cells.length && boardState.rows.enumerate(row => (
                    <CellRow>
                        {boardState.columns.enumerate(col => (
                            <DisplayCell 
                                size={cellSize}
                                cell={cells[row][col]}
                                onMouseEnter={() => onCellEnter(cells[row][col])}
                                onMouseLeave={onCellLeave}
                                onClick={() => onCellClick({x: col, y: row})}
                                selected={selectedCell === cells[row][col]} 
                                key={`${col},${row}`} 
                            />
                        ))}
                    </CellRow>
                ))}
            </BoardContainer>
        </OuterContainer>
    );
}

export default Board;

const OuterContainer = styled.div`
    flex-grow: 1;
    display: flex;
    justify-content: center;
    overflow: hidden;
    padding-top: 1rem;
    
    @media(min-width:${p => p.theme.breakpoints.md}px) {
        justify-content: flex-end;
        padding-top: 0;
        padding-left: .5rem;
    }
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

const TooltipContent = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 14px;
    gap: 5px;
    max-width: 200px;
    color: #374151;
`