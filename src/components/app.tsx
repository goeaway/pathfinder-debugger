import { Algo, BoardState, Cell, Cells, CellType, CellUpdate, Pos, RunSettings } from "@src/types";
import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Board from "./board";
import Editor from "./editor";
import Menu from "./menu";
import Dark from "@src/themes/dark";
import algorithms from "@src/algorithms";
import { useCodeStorage } from "@src/hooks/use-code-storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCampground, faChessBoard, faCode, faHiking, faMinusCircle, faMountain, faPlay, faRoute, faStar, faStop, faTree } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import IconButton from "./icon-button";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const getDefaultBoardState = (rows: number, columns: number) : BoardState => {
    return {
        rows,
        columns,
        walls:[],
        start: null,
        end: null,
        weights: [],
        checked: [],
        shortestPath: []
    }
}

const RENDER_WAIT_DEFAULT = 25;
const COLUMNS = 20;
const ROWS = 20;

const App = () => {
    const { getCode, saveCode, getBoardState, saveBoardState } = useCodeStorage();
    const [running, setRunning] = useState(false);
    const [algo, setAlgo] = useState<{algo: Algo, code: string}>(getCode() || { algo: algorithms[0], code: ""});
    const [boardState, setBoardState] = useState<BoardState>(getBoardState() || getDefaultBoardState(ROWS, COLUMNS));
    const [runningCancelled, setRunningCancelled] = useState(false);
    const [onClickSetType, setOnClickSetType] = useState<CellType>("start");

    useEffect(() => {
        const getSettingsForRun = () : RunSettings => {
            // return current settings
            return {
                columns: boardState.columns,
                rows: boardState.rows,
                start: boardState.start,
                end: boardState.end,
                walls: boardState.walls
            }
        }

        const updater = (cellUpdates: Array<CellUpdate>) : Promise<void> => {
            // foreach cell update, 
            // find the cell at the same pos
            // update its checkCount by the amount
            return new Promise((res, rej) => {
                if(cellUpdates) {
                    const newState = Object.assign({}, boardState);

                    cellUpdates.forEach(cu => {
                        // if this cell already has a checked value
                        const checkedIndex = newState.checked.findIndex(c => c.pos.x == cu.pos.x && c.pos.y == cu.pos.y);
                        if(checkedIndex > -1) {
                            newState.checked[checkedIndex].count += cu.checkCountUpdate;
                        } else {
                            newState.checked.push({pos: cu.pos, count: cu.checkCountUpdate});
                        }
                    });

                    setBoardState(newState);
                    setTimeout(res, RENDER_WAIT_DEFAULT);
                } else {
                    res();
                }
            })
        }

        // add window.board api
        window.board = {
            cancelled: () => runningCancelled,
            updater,
            run: (pathfinderRunner: (settings: RunSettings) => Promise<Array<Pos>>) => {
                // reset the board state
                setBoardState(s => {
                    s.checked = [];
                    s.shortestPath = [];
                    return s;
                });

                // set that we're running, then call the runner function
                setRunning(true);

                pathfinderRunner(getSettingsForRun())
                    .then(async path => {
                        setRunning(false);
                        
                        // provides an array of positions in the shortest path, order is important
                        // if path not possible, null is provided
                        
                        if(path) {
                            // each time i update one of the ones on the path, 
                            // i want to update the board
                            for(const pos of path) {
                                const newState = Object.assign({}, boardState);
                                newState.shortestPath.push(pos);
                                
                                await new Promise(res => setTimeout(() => {
                                    setBoardState(newState);
                                    res(null);
                                }, RENDER_WAIT_DEFAULT));
                            }

                            toast(`${path.length -1} step path found`, 
                                { 
                                    duration: 5000,
                                    icon: <>
                                        <FontAwesomeIcon icon={faRoute} />
                                    </>
                                }
                            );
                        } else {
                            toast.error("No path could be found", { duration: 5000 });
                        }

                        setRunningCancelled(false);
                    });
            }
        }
    }, [boardState, runningCancelled]);

    useEffect(() => {
        saveBoardState(boardState);
    }, [boardState]);

    useEffect(() => {
        saveCode(algo);
    }, [algo]);

    const onRunHandler = () => {
        if(running) {
            // cancel running
            setRunningCancelled(true);
            toast("Run Stopped", {
                icon: <FontAwesomeIcon icon={faStop} color="#B91C1C"/>,
                duration: 2000
            });
        } else {
            // ensure we have a start and a finish
            if(!boardState.start || !boardState.end) {
                return;
            }
            
            // eval the editor code
            try {
                // add cancellable promise calling code here in string form and then ${algo.code} within
                // the canceller should listen to setRunningCancelled and 

                // wrap algo code in async function, 
                // add canceller promise
                // await algo code
                const evaluator = new Function(algo.code);
                evaluator();
            } catch (e) {
                const error = e as Error;
                toast.error(
                    <div>
                        <div>
                            Error occurred when running algorithm
                        </div>
                        <pre>
                            {error.message}
                        </pre>
                    </div>, {
                    duration: 8000
                });
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

    const onCodeResetHandler = () => {
        const newAlgo = Object.assign({}, algo);
        newAlgo.code = algo.algo.source;
        setAlgo(newAlgo);

        toast("Code Reset", {
            duration: 5000,
            icon: <FontAwesomeIcon icon={faCode} />
        });
    }

    const onBoardResetHandler = () => {
        const newState = Object.assign({}, boardState);
        newState.checked = [];
        newState.shortestPath = [];
        newState.start = null;
        newState.end = null;
        newState.walls = [];
        newState.weights = [];
        setBoardState(newState);

        toast("Reset Board", {
            duration: 5000,
            icon: <FontAwesomeIcon icon={faChessBoard} />
        });
    }

    const onTypeChangeClick = () => {
        let toastMessage = "";
        let toastIcon: IconProp = null;
        switch(onClickSetType) {
            case "start":
                setOnClickSetType("end");
                toastMessage = "Set the end position on the board";
                toastIcon = faCampground;
                break;
            case "end":
                setOnClickSetType("wall");
                toastMessage = "Add walls to the board";
                toastIcon = faMountain;
                break;
            case "wall":
                setOnClickSetType("weight");
                toastMessage = "Add weights to the board";
                toastIcon = faTree;
                break;
            case "weight":
                setOnClickSetType("start");
                toastMessage = "Set the start position on the board";
                toastIcon = faHiking;
                break;
        }

        toast(toastMessage, { duration: 2000, icon: <FontAwesomeIcon icon={toastIcon} />})
    }

    const getSettingIcon = () => {
        switch(onClickSetType) {
            case "start":
                return faHiking;
            case "end":
                return faCampground;
            case "wall": 
                return faMountain;
            case "weight": 
                return faTree;
        }
    }

    const getSettingTitle = () => {
        switch(onClickSetType) {
            case "start":
                return "Click on a cell on the board to set the start";
            case "end":
                return "Click on a cell on the board to set the end";
            case "wall": 
                return "Click on a cell on the board to add a wall there";
            case "weight":
                return "Click on a cell on the board to add a weight there";
        }
    }

    return (
        <ThemeProvider theme={Dark}>
            <AppContainer role="app">
                <Toaster toastOptions={{className: "notifications"}} />
                <TopBar>
                    <Title>Pathfinder Debugger</Title>
                    <Controls>
                        <IconButton icon={faCode} onClick={onCodeResetHandler} title="Reset your code" />
                        <IconButton icon={faChessBoard} onClick={onBoardResetHandler} title="Reset the board" />
                        <IconButton icon={getSettingIcon()} onClick={onTypeChangeClick} title={getSettingTitle()} />
                        <RunButton 
                            onClick={onRunHandler} 
                            running={running}>
                                {(running ? <><FontAwesomeIcon icon={faStop}/>&nbsp;&nbsp;Stop</> : <><FontAwesomeIcon icon={faPlay}/>&nbsp;&nbsp;Run</>)}
                        </RunButton>
                    </Controls>
                </TopBar>
                <Menu onAlgorithmChange={onAlgorithmChangeHandler} />
                <ContentContainer>
                    <Editor code={algo.code} onCodeChange={onCodeChangeHandler} />
                    <Board canEdit={!running} boardState={boardState} onBoardStateChange={setBoardState} onCellClickType={onClickSetType} />
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
    padding: .5rem;
    background: #F3F4F6;

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

    .notifications {
        opacity: 1 !important;
    }
`

const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    grid-column-start: 1;
    grid-column-end: 3;
    margin-bottom: .5rem;
`

const Controls = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
`

interface RunButtonProps {
    running?: boolean;
}

const RunButton = styled.button`
    border: none;
    border-radius: 6px;
    height: 50px;
    font-size: 16px;
    padding: 1rem;
    cursor: pointer;
    transition: background 300ms ease;
    color: white;
    outline: none;

    background: ${(p: RunButtonProps) => p.running ? "rgb(220,38,38)" : "rgb(52,211,153)"};
    background: ${(p: RunButtonProps) => p.running ? "linear-gradient(126deg, rgba(220,38,38,1) 0%, rgba(153,27,27,1) 100%)" : "linear-gradient(126deg, rgba(5,150,105,1) 0%, rgba(6,95,70,1) 100%)"}; 

    &:hover {
        background: ${(p: RunButtonProps) => p.running ? "rgb(220,38,38)" : "rgb(5,150,105)"};
        background: ${(p: RunButtonProps) => p.running ? "linear-gradient(346deg, rgba(220,38,38,1) 0%, rgba(153,27,27,1) 100%)" : "linear-gradient(346deg, rgba(5,150,105,1) 0%, rgba(6,95,70,1) 100%);"};
    }
`

const ContentContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;

    @media(min-width:${p => p.theme.breakpoints.sm}px) {
        display: grid;
        grid-template-columns: 50% 50%;
    }
`

const Title = styled.h1`
    font-size: 30px;
    line-height: 40px;
    padding: 0;
    margin: 0;
`