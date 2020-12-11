import { Cell, Cells, CellUpdate, Pos, RunSettings } from "@src/types";
import React, { cloneElement, useEffect, useState } from "react";
import styled from "styled-components";
import Board from "./board";
import Editor from "./editor";
import Controls from "./controls";

const generateCells = (x: number, y: number) => {
    const yArr = new Array<Array<Cell>>(y);

    for(let i = 0; i < yArr.length; i++) {
        yArr[i] = new Array<Cell>(x);

        for(let j = 0; j < yArr[i].length; j++) {
            yArr[i][j] = {};
        }
    }

    return yArr;
}

const RENDER_WAIT_DEFAULT = 25;

const App = () => {
    const [running, setRunning] = useState(false);
    const [code, setCode] = useState("");
    const X = 20;
    const Y = 10;

    const [cells, setCells] = useState<Cells>(generateCells(X, Y));

    useEffect(() => {
        const getSettingsForRun = () : RunSettings => {
            // return current settings
            let start: Pos = null;
            let end: Pos = null;
            const walls: Array<Pos> = [];

            for(let i = 0; i < cells.length; i++) {
                for(let j = 0; j < cells[i].length; j++) {
                    const cell = cells[i][j];
                    switch(cell.type) {
                        case "start":
                            start = {x:j,y:i};
                            break;
                        case "end":
                            end = {x:j,y:i};
                            break;
                        case "wall":
                            walls.push({x:j,y:i})
                            break;
                    }
                }
            }

            return {
                x: X,
                y: Y,
                start,
                end,
                walls
            }
        }

        const updater = (cellUpdates: Array<CellUpdate>) : Promise<void> => {
            // foreach cell update, 
            // find the cell at the same pos
            // update its checkCount by the amount
            return new Promise((res, rej) => {
                if(cellUpdates) {
                    const copy = [...cells];
                    cellUpdates.forEach(cu => {
                        if(copy[cu.pos.y][cu.pos.x].checkCount == null) {
                            copy[cu.pos.y][cu.pos.x].checkCount = cu.checkCountUpdate;
                        } else {
                            copy[cu.pos.y][cu.pos.x].checkCount += cu.checkCountUpdate;
                        }
                    });
                    setCells(copy);

                    setTimeout(res, RENDER_WAIT_DEFAULT);
                }
            })
        }

        // add window.board api
        window.board = {
            run: (pathfinderRunner: (
                    settings: RunSettings, 
                    updater: (cellUpdates: Array<CellUpdate>) => Promise<void>) => Promise<Array<Pos>>) => {

                // reset the cell states
                const copy = [...cells];
                copy.forEach(row => row.forEach(cell => {
                    cell.checkCount = 0;
                    cell.shortestPath = false;
                }));
                setCells(copy);

                // set that we're running, then call the runner function
                setRunning(true);
                pathfinderRunner(getSettingsForRun(), updater)
                    .then(async path => {
                        setRunning(false);

                        // provides an array of positions in the shortest path, order is important
                        // if path not possible, null is provided
                        const copy = [...cells];

                        copy.forEach(row => row.filter(cell => cell.shortestPath).forEach(cell => cell.shortestPath = false));
                        setCells(copy);

                        if(path) {
                            // each time i update one of the ones on the path, 
                            // i want to update the board
                            for(const pos of path) {
                                const c = [...cells];
                                c[pos.y][pos.x].shortestPath = true;
    
                                await new Promise(res => setTimeout(() => {
                                    setCells(c);
                                    res();
                                }, RENDER_WAIT_DEFAULT));
                            }
                        }
                    });
            }
        }
    }, [cells]);

    const onRunHandler = () => {
        // ensure we have a start and a finish

        // eval the editor code
        try {
            eval(code);
        } catch (e) {
            const error = e as Error;
            console.error(error.stack);
        }
    };

    const onSkipHandler = () => {

    }

    const onCodeChangeHandler = (value: string) => {
        setCode(value);
    }

    return (
        <Container role="app">
            <Controls onRun={onRunHandler} onSkip={onSkipHandler} running={running} />
            <Editor code={code} onCodeChange={onCodeChangeHandler} />
            <Board cells={cells} onCellsChange={setCells} />
        </Container>
    );
}

export default App;

const Container = styled.div`
    font-family: 'Poppins', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
`