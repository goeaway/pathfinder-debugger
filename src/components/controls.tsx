import React from "react";

export interface ControlsProps {
    onRun: () => void;
    onSkip: () => void;
    running?: boolean;
}

const Controls : React.FC<ControlsProps> = ({onRun, onSkip, running}) => {
    return (
        <div>
            <button onClick={onRun}>Run</button>
            {running && (
                <button onClick={onSkip}>Skip</button>
            )}
        </div>
    );
}

export default Controls;