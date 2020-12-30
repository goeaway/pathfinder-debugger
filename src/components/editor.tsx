import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/mode-javascript";
import styled from "styled-components";



export interface EditorProps {
    code: string;
    onCodeChange: (value: string) => void;
    onReset: () => void;
}

const Editor : React.FC<EditorProps> = ({code, onCodeChange, onReset}) => {
    return (
        <Container>
            
            <AceEditor 
                mode="javascript"
                theme="xcode"
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
                <button type="button" onClick={onReset}>Reset</button>
            </Controls>
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
        box-shadow:
  0 2.8px 2.2px rgba(0, 0, 0, 0.02),
  0 6.7px 5.3px rgba(0, 0, 0, 0.028),
  0 12.5px 10px rgba(0, 0, 0, 0.035),
  0 22.3px 17.9px rgba(0, 0, 0, 0.042),
  0 41.8px 33.4px rgba(0, 0, 0, 0.05),
  0 100px 80px rgba(0, 0, 0, 0.07)
;
    }
`

const Controls = styled.div`
    padding: .5rem 0;   
`