import { useRadioGroup } from "@material-ui/core";
import { Cells, CellType, Pos } from "@src/types";
import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import styled from "styled-components";
import DisplayCell from "./display-cell";

export interface BoardProps {
    cells: Cells;
    onCellsChange?: (newCells: Cells) => void;
}

const Board: React.FC<BoardProps> = ({cells, onCellsChange}) => { 
    const [selectedPos, setSelectedPos] = useState<Pos>(null);
    const boardContainerRef = useRef<HTMLDivElement>();
    const [cellSize, setCellSize] = useState(0);
    const [onClickSetType, setOnClickSetType] = useState<CellType>("start");

    const actionHandler = (type: CellType, actionPos: Pos, actionCells: Cells, actionCellChange: (newCells: Cells) => void) => {
        switch(type) {
            case "start": {
                let currentStart: Pos = null;

                actionCells.forEach((column, y) => {
                    column.forEach((c, x) => {
                        if(c.type === "start") {
                            currentStart = {x,y};
                            return;
                        }
                    });
                    if(currentStart) {
                        return;
                    }
                });

                if(currentStart) {
                    const currentStartCell = actionCells[currentStart.y][currentStart.x];
                    currentStartCell.type = null;
                }

                actionCells[actionPos.y][actionPos.x].type = "start";
                actionCellChange(actionCells);

                break;
            }
            case "wall": {
                // find pos in cells, toggle wall flag
                actionCells[actionPos.y][actionPos.x].type = actionCells[actionPos.y][actionPos.x].type === "wall" ? null : "wall";
                actionCellChange(actionCells);
                break;
            }
            case "end": {
                let currentEnd: Pos = null;

                actionCells.forEach((column, y) => {
                    column.forEach((c, x) => {
                        if(c.type === "end") {
                            currentEnd = {x,y};
                            return;
                        }
                    });
                    if(currentEnd) {
                        return;
                    }
                });

                if(currentEnd) {
                    const currentEndCell = actionCells[currentEnd.y][currentEnd.x];
                    currentEndCell.type = null;
                }

                actionCells[actionPos.y][actionPos.x].type = "end";
                actionCellChange(actionCells);

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
                ? cells[0].length - 1
                : rawX > cells[0].length - 1 
                    ? 0 : rawX;
            const fixedY = rawY < 0
                ? cells.length - 1
                : rawY > cells.length - 1
                    ? 0 : rawY;

            setSelectedPos({x: fixedX, y: fixedY});
        };

        // handle key presses for certain keys to peform actions
        const actionPressHandler = ({key}: KeyboardEvent) => {
            const handledKeys = ["s", "w", "e", "q"];
            // only do things if there is a selected cell or the key is in the above
            if(!selectedPos || !handledKeys.includes(key)) {
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

            const copy = [...cells];
            actionHandler(type, selectedPos, copy, onCellsChange);
        };

        window.addEventListener("keydown", arrowPressHandler);
        window.addEventListener("keydown", actionPressHandler);

        return () => {
            window.removeEventListener("keydown", arrowPressHandler);
            window.removeEventListener("keydown", actionPressHandler);
        }
    }, [selectedPos, cells]);

    useLayoutEffect(() => {
        const cellSizeHandler = () => {
            // get smallest of height and width of board container
            // divide that by the amount of cells we have in that dimension
            // set cellSize to be that calc
            if(boardContainerRef.current) {
                const { height, width } = boardContainerRef.current.getBoundingClientRect();

                const maxCellWidth = Math.floor(width / cells[0].length);
                const maxCellHeight = Math.floor(height / cells.length);

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
        if(onClickSetType) {
            const copy = [...cells];
            actionHandler(onClickSetType, pos, copy, onCellsChange);
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
        const copy = [...cells];
        copy.forEach(row => row.forEach(cell => {
            cell.type = null;
            cell.checkCount = 0;
            cell.shortestPath = false;
        }));
        onCellsChange(copy);
    }

    return (
        <OuterContainer>
            <BoardContainer role="board" ref={boardContainerRef}>
                {cells.map((cellRow, iy) => (
                    <CellRow>
                        {cellRow.map((cell, ix) => (
                            <DisplayCell 
                                size={cellSize}
                                cell={cell}
                                onMouseEnter={() => onCellEnter({x: ix, y: iy})}
                                onMouseLeave={onCellLeave}
                                onClick={() => onCellClick({x: ix, y: iy})}
                                selected={selectedPos && ix === selectedPos.x && iy === selectedPos.y} 
                                key={`${ix},${iy}`} />
                            ))}
                    </CellRow>
                ))}
            </BoardContainer>
            <Controls>
                <button type="button" onClick={onTypeChangeClick}>{onClickSetType}</button>
                <button type="button" onClick={onClearClick}>Clear</button>
            </Controls>
        </OuterContainer>
    );
}

export default Board;

const OuterContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 3;
    padding: 2rem; 
    flex-direction: column;
`

const Controls = styled.div`
    padding: .5rem;
`

const BoardContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    justify-content: center;
`

const CellRow = styled.div`
    display: flex;
    justify-content: center;
`