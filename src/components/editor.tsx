import React, { useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/mode-javascript";
import { Algo } from "@src/types";
import styled from "styled-components";



export interface EditorProps {
    code: string;
    onCodeChange: (value: string) => void;
}

const Editor : React.FC<EditorProps> = ({code, onCodeChange}) => {
    return (
        <Container>
            
            <AceEditor 
                mode="javascript"
                theme="twilight"
                onChange={onCodeChange}
                name="code-editor"
                value={code}
                fontSize="12px"
                width="100%"
                height="100%"
                editorProps={{
                    showLineNumbers: true,
                    tabSize: 4
                }}
            />
            <Controls>
                <button type="button">Reset</button>
            </Controls>
        </Container>
    );
}

export default Editor;

const Container = styled.div`
    flex-grow: 5;
    display: flex;
    flex-direction: column;
    border-right: 1px solid black;
    border-left: 1px solid black;
`

const Controls = styled.div`
    padding: .5rem 0;   
`