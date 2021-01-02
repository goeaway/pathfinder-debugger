import { Algo, BoardState, Cell, Cells, CellType, CellUpdate, EditableAlgo, Pos, RunSettings } from "@src/types";
import React, { useEffect, useRef, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Board from "./board";
import Editor from "./editor";
import Menu from "./menu";
import Dark from "@src/themes/dark";
import algorithms from "@src/algorithms";
import { useCodeStorage } from "@src/hooks/use-code-storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCampground, faChessBoard, faCode, faCog, faDiceSix, faExclamationTriangle, faHiking, faMountain, faPlay, faPlusCircle, faQuestion, faRoute, faStar, faStop, faTree, faUndo, faUndoAlt } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import IconButton from "./icon-button";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { HiddenSm } from "@src/utility-components";
import Popover from "./popover";
import getTypeIcon from "@src/utils/get-type-icon";
import getTypeDescription from "@src/utils/get-type-description";

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
    const [algo, setAlgo] = useState<EditableAlgo>(getCode() || {...algorithms[0], code: ""});
    const [boardState, setBoardState] = useState<BoardState>(getBoardState() || getDefaultBoardState(ROWS, COLUMNS));
    const [runningCancelled, setRunningCancelled] = useState(false);
    const [onClickSetType, setOnClickSetType] = useState<CellType>("start");
    const [showHelp, setShowHelp] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const helpButtonRef = useRef<HTMLButtonElement>(null);
    const settingsButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const getSettingsForRun = () : RunSettings => {
            // return current settings
            return {
                columns: boardState.columns,
                rows: boardState.rows,
                start: boardState.start,
                end: boardState.end,
                walls: boardState.walls,
                weights: boardState.weights
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
                                    icon: <FontAwesomeIcon icon={faRoute} />
                                }
                            );
                        } else {
                            // unset any shortest path or check count cells
                            const newState = Object.assign({}, boardState);
                            newState.shortestPath = [];
                            setBoardState(newState);
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
            const hasStart = !!boardState.start;
            const hasEnd = !!boardState.end;
            // ensure we have a start and a finish
            if(!hasStart || !hasEnd) {
                let message = "";
                let icon = null;

                if(!hasStart && !hasEnd) {
                    message = "Add a start and end to the board.";
                    icon = faExclamationTriangle;
                } else if (!hasStart) {
                    message = "Add a start to the board.";
                    icon = faHiking;
                } else {
                    message = "Add an end to the board.";
                    icon = faCampground;
                }

                toast(message, {
                    icon: <FontAwesomeIcon icon={icon} />,
                    duration: 5000
                });
                return;
            }
            
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
        setAlgo({...algo, code: algo.source});
    }

    const onCodeResetHandler = () => {
        const newAlgo = Object.assign({}, algo);
        newAlgo.code = algo.source;
        setAlgo(newAlgo);

        toast("Code Reset", {
            duration: 5000,
            icon: <FontAwesomeIcon icon={faUndo} />
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

        toast("Board Reset", {
            duration: 5000,
            icon: <FontAwesomeIcon icon={faUndoAlt} />
        });
    }

    const onRandomiseBoardHandler = () => {
        toast("Board Randomised", {
            duration: 2000,
            icon: <FontAwesomeIcon icon={faDiceSix} />
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

    const onHelpClickHandler = () => {
        setShowHelp(s => !s);
    }

    const onHelpDismissHandler = () => {
        setShowHelp(false);
    }

    const onSettingsClickHandler = () => {
        setShowSettings(s => !s);
    }

    const onSettingsDismissHandler = () => {
        setShowSettings(false);
    }

    const getSettingTitle = () => {
        const base = "Click here to cycle cell types."
        switch(onClickSetType) {
            case "start":
                return "Click a cell to set the start. " + base;
            case "end":
                return "Click a cell to set the end. " + base;
            case "wall": 
                return "Click a cell to add a wall there. " + base;
            case "weight":
                return "Click a cell to add a weight there. " + base;
        }
    }

    return (
        <ThemeProvider theme={Dark}>
            <AppContainer role="app">
                <Toaster toastOptions={{className: "notifications"}} />
                <TopBar>
                    <Popover show={showHelp} onDismissed={onHelpDismissHandler} handle={helpButtonRef} position="bottomleft">
                        <PopoverContent>
                            <HelpText>
                                Add a Start, End, Walls and Weights to the board.
                            </HelpText>
                            <HelpText>
                                Then Run the algorithm of your choice and see how it performs.
                            </HelpText>
                            <HelpText>
                                Start&nbsp;<FontAwesomeIcon icon={faHiking} />
                            </HelpText>
                            <HelpTextSmall>
                                {getTypeDescription("start")}. Press <b>S</b> while selecting a cell to add.    
                            </HelpTextSmall>
                            <HelpText>
                                End&nbsp;<FontAwesomeIcon icon={faCampground} />
                            </HelpText>
                            <HelpTextSmall>
                                {getTypeDescription("end")}. Press <b>E</b> while selecting a cell to add.
                            </HelpTextSmall>
                            <HelpText>
                                Wall&nbsp;<FontAwesomeIcon icon={faMountain} />
                            </HelpText>
                            <HelpTextSmall>
                                {getTypeDescription("wall")}. Press <b>W</b> while selecting a cell to add.
                            </HelpTextSmall>
                            <HelpText>
                                Weight&nbsp;<FontAwesomeIcon icon={faTree} />
                            </HelpText>
                            <HelpTextSmall>
                                {getTypeDescription("weight")}. Press <b>Q</b> while selecting a cell to add.
                            </HelpTextSmall>
                        </PopoverContent>
                    </Popover>
                    <Popover show={showSettings} onDismissed={onSettingsDismissHandler} handle={settingsButtonRef} position="bottomleft">

                    </Popover>
                    <TitleSection>
                        <Title>Pathfinder Debugger</Title>
                        <Description>Test pre made or custom pathdfinding algorithms with this online tool.</Description>
                    </TitleSection>
                    <Controls>
                        <IconButton icon={faQuestion} onClick={onHelpClickHandler} title="Help" ref={helpButtonRef} />
                        <IconButton icon={faCode} secondaryIcon={faUndoAlt} onClick={onCodeResetHandler} title="Reset your code" />
                        <IconButton icon={faChessBoard} secondaryIcon={faUndoAlt} onClick={onBoardResetHandler} title="Reset the board" />
                        <IconButton icon={faDiceSix} onClick={onRandomiseBoardHandler} title="Randomise the board. Possible routes are not guaranteed" />
                        <IconButton icon={faCog} onClick={onSettingsClickHandler} ref={settingsButtonRef} title="Settings" />
                        <IconButton icon={getTypeIcon(onClickSetType)} secondaryIcon={faPlusCircle} onClick={onTypeChangeClick} title={getSettingTitle()} />
                        <RunButton 
                            title={running ? "Stop the run" : "Run the code to test the algorithm"}
                            onClick={onRunHandler} 
                            running={running}>
                                {(running ? <><FontAwesomeIcon icon={faStop}/><HiddenSm>&nbsp;&nbsp;Stop</HiddenSm></> : <><FontAwesomeIcon icon={faPlay}/><HiddenSm>&nbsp;&nbsp;Run</HiddenSm></>)}
                        </RunButton>
                    </Controls>
                </TopBar>
                <ContentContainer>
                    <Editor algo={algo} onCodeChange={onCodeChangeHandler} onAlgorithmChange={onAlgorithmChangeHandler} />
                    <Board canEdit={!running} boardState={boardState} onBoardStateChange={setBoardState} onCellClickType={onClickSetType} />
                </ContentContainer>
            </AppContainer>
        </ThemeProvider>
    );
}

export default App;

const AppContainer = styled.div`
    font-family: 'Roboto', sans-serif;
    color: #1F2937;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: .5rem 1rem;
    background: #F3F4F6;

    > * {
        width: 100%;
    }

    button {
        font-family: 'Roboto', sans-serif;
    }

    .notifications {
        opacity: 1 !important;
    }
`

const TopBar = styled.div`
    display: flex;
    flex-direction: column;
    gap: .5rem;
    align-items: center;
    justify-content: space-between;
    grid-column-start: 1;
    grid-column-end: 3;
    margin-bottom: .5rem;

    @media(min-width:${p => p.theme.breakpoints.sm}px) {
        flex-direction: row;
    }
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

    @media(min-width:${p => p.theme.breakpoints.md}px) {
        display: grid;
        grid-template-columns: 50% 50%;
    }
`

const TitleSection = styled.div`
    display: flex;
    flex-direction: column;
    padding-right: 1rem;
    text-align: center;

    @media(min-width: ${p => p.theme.breakpoints.sm}px) {
        text-align: left;
    }
`
    
const Description = styled.div`
    font-size: 14px;
    color: #4B5563;
`
    
const Title = styled.h1`
    font-size: 30px;
    line-height: 40px;
    padding: 0;
    margin: 0;
`

const PopoverContent = styled.div`
    display: flex;
    flex-direction: column;
`

const HelpText = styled.p`
    display: flex;
    margin: .5rem 0;
`

const HelpTextSmall = styled.p`
    margin: 0;
    margin-bottom: .5rem;
    font-size: 14px;
    color: #6B7280;
`