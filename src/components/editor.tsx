import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/mode-javascript";
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
                theme="tomorrow"
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
        </Container>
    );
}

export default Editor;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 300px;
    min-width: 300px;

    #code-editor {
        border-radius: 6px;
        border: 1px solid #D1D5DB;
    }
`