import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/mode-javascript";
import styled, { css } from "styled-components";
import algorithms from "@src/algorithms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFeatherAlt, faPen, faWeightHanging } from "@fortawesome/free-solid-svg-icons";
import { Algo, AlgoType, EditableAlgo } from "@src/types";

export interface EditorProps {
    algo: EditableAlgo;
    onCodeChange: (value: string) => void;
    onAlgorithmChange: (algo: Algo) => void;
}

const Editor : React.FC<EditorProps> = ({algo, onCodeChange, onAlgorithmChange}) => {
    const onAlgorithmTabClickHandler = (id: string) => {
        onAlgorithmChange(algorithms.find(a => a.id === id));
    }

    const getIconForType = (type: AlgoType) => {
        switch (type) {
            case "custom":
                return faPen;
            case "weighted":
                return faWeightHanging;
            case "unweighted":
                return faFeatherAlt;
        }
    }

    return (
        <Container>
            <TabContainer>
                {algorithms.map(a => (
                    <Button 
                        key={a.id}
                        active={algo.id === a.id}
                        onClick={() => onAlgorithmTabClickHandler(a.id)}>
                        <FontAwesomeIcon icon={getIconForType(a.type)} />&nbsp;
                        {a.name}
                    </Button>
                ))}
            </TabContainer>
            <AceEditor 
                mode="javascript"
                theme="tomorrow"
                onChange={onCodeChange}
                name="code-editor"
                value={algo.code}
                fontSize="14px"
                width="100%"
                height="100%"
                editorProps={{
                    showLineNumbers: true,
                    tabSize: 4
                }}
            />
        </Container>
    );
}

export default Editor;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 300px;
    min-width: 300px;
    border-radius: 6px;
    border: 2px solid #4B5563;
    background: white;
    overflow: hidden;
`

const TabContainer = styled.div`
    display: flex;
    background: #F6F6F6;
`

interface ButtonProps {
    active: boolean;
}

const Button = styled.button`
    border: none;
    border-bottom: 2px solid transparent;
    background: none;
    padding: .75rem;
    cursor: pointer;
    transition: background 300ms ease;
    outline: none;

    ${(p: ButtonProps) => p.active && css`
        border-bottom: 2px solid #9CA3AF;
    `}

    ${(p: ButtonProps) => !p.active && css`
        &:hover {
            background: #D1D5DB;
        }
    `}
`