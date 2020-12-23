import { Algo, Cell, Cells, CellUpdate, Pos, RunSettings } from "@src/types";
import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Board from "./board";
import Editor from "./editor";
import Menu from "./menu";
import Dark from "@src/themes/dark";
import algorithms from "@src/algorithms";
import { useCodeStorage } from "@src/hooks/use-code-storage";

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
    const { getCode, saveCode, getGrid, saveGrid } = useCodeStorage();
    const [running, setRunning] = useState(false);
    const [algo, setAlgo] = useState<{algo: Algo, code: string}>(getCode() || { algo: algorithms[0], code: ""});
    const X = 20;
    const Y = 20;
    const [cells, setCells] = useState<Cells>(getGrid() || generateCells(X, Y));
    const [runningCancelled, setRunningCancelled] = useState(false);

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
                } else {
                    res();
                }
            })
        }

        // add window.board api
        window.board = {
            cancelled: () => runningCancelled,
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
                        setRunningCancelled(false);

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
                                    res(null);
                                }, RENDER_WAIT_DEFAULT));
                            }
                        }
                    });
            }
        }
    }, [cells, runningCancelled]);

    useEffect(() => {
        saveGrid(cells);
    }, [cells]);

    useEffect(() => {
        saveCode(algo);
    }, [algo]);

    const onRunHandler = () => {
        if(running) {
            // cancel running
            setRunningCancelled(true);
        } else {
            // ensure we have a start and a finish
            const hasStart = cells.some(row => row.some(cell => cell.type === "start"));
            const hasEnd = cells.some(row => row.some(cell => cell.type === "end"));

            if(!hasStart || !hasEnd) {
                return;
            }

            // eval the editor code
            try {
                eval(algo.code);
            } catch (e) {
                const error = e as Error;
                console.error(error.stack);
            }
        }
    };

    const onCodeChangeHandler = (value: string) => {
        const newAlgo = Object.assign({}, algo);
        newAlgo.code = value;
        setAlgo(newAlgo);
    }

    const onAlgorithmChangeHandler = (algo: Algo) => {
        setAlgo({ algo, code: algo.source});
    }

    const onResetHandler = () => {
        const newAlgo = Object.assign({}, algo);
        newAlgo.code = algo.algo.source;
        setAlgo(newAlgo);
    }

    return (
        <ThemeProvider theme={Dark}>
            <AppContainer role="app">
                <TopBar>
                    <Title>Pathfinder Debugger</Title>
                    <RunButton onClick={onRunHandler} running={running}>{(running ? "Stop" : "Run")}</RunButton>
                </TopBar>
                <Menu onAlgorithmChange={onAlgorithmChangeHandler} />
                <ContentContainer>
                    <Editor code={algo.code} onCodeChange={onCodeChangeHandler} onReset={onResetHandler} />
                    <Board cells={cells} onCellsChange={setCells} />
                </ContentContainer>
            </AppContainer>
        </ThemeProvider>
    );
}

export default App;

const AppContainer = styled.div`
    font-family: 'Roboto', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;

    > * {
        width: 100%;
    }

    button {
        font-family: 'Roboto', sans-serif;
    }

    @media(min-width:${p => p.theme.breakpoints.sm}px) {
        display: grid;
        grid-template-rows: min-content auto;
        grid-template-columns: 90px auto;
    }
`

const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    grid-column-start: 1;
    grid-column-end: 3;
    border-bottom: 1px solid black;
`
interface RunButtonProps {
    running?: boolean;
}

const RunButton = styled.button`
    border: none;
    height: 50px;
    font-size: 16px;
    padding: 1rem;
    cursor: pointer;
    transition: background 300ms ease;

    background: ${(p: RunButtonProps) => p.running ? "red" : "green"};
    color: white;

    &:hover {
        background: ${(p: RunButtonProps) => p.running ? "darkred" : "darkgreen"};
    }
`

const ContentContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    @media(min-width:${p => p.theme.breakpoints.sm}px) {
        flex-direction: row;
        overflow-y: hidden;
        overflow-x: auto;
    }
`

const Title = styled.h1`
    font-size: 30px;
    line-height: 40px;
    padding: .3rem 1rem;
    margin: 0;
`