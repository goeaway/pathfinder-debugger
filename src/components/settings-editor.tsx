import { faRulerCombined, faTachometerAlt, faMountain, faTree, faClock, faUndo, faDiceSix } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useTooltip from "@src/hooks/use-tooltip";
import { AppSettings } from "@src/types";
import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import IconWithSecondary from "./icon-with-secondary";
import TooltipHandle from "./tooltip-handle";

export interface SettingsEditorProps {
    settings: AppSettings;
    onSettingsChanged: (settings: AppSettings) => void;
}

const SettingsEditor : FC<SettingsEditorProps> = ({settings, onSettingsChanged}) => {
    const [updateSpeed, setUpdateSpeed] = useState(settings.updateSpeed + "");
    const [pWalls, setPWalls] = useState(settings.percentWalls + "");
    const [pWeights, setPWeights] = useState(settings.percentWeights + "");

    useEffect(() => {
        setUpdateSpeed(settings.updateSpeed + "");
        setPWalls(settings.percentWalls + "");
        setPWeights(settings.percentWeights + "");
    }, [settings]);

    useEffect(() => {
        const newSettings = Object.assign({}, settings);
        const updateSpeedNum = Number(updateSpeed);

        newSettings.updateSpeed = isNaN(updateSpeedNum) ? 25 :
            updateSpeedNum < 0 ? 0 :
            updateSpeedNum;

        onSettingsChanged(newSettings);
    }, [updateSpeed]);

    useEffect(() => {
        const newSettings = Object.assign({}, settings);
        const pWallsNum = Number(pWalls);

        newSettings.percentWalls = isNaN(pWallsNum) ? 30 :
            pWallsNum < 0 ? 0 :
            pWallsNum > 40 ? 40 :
            pWallsNum;

        onSettingsChanged(newSettings);
    }, [pWalls]);

    useEffect(() => {
        const newSettings = Object.assign({}, settings);
        const pWeightsNum = Number(pWeights);

        newSettings.percentWeights = isNaN(pWeightsNum) ? 20 :
            pWeightsNum < 0 ? 0 :
            pWeightsNum > 40 ? 40 :
            pWeightsNum;

            onSettingsChanged(newSettings);
    }, [pWeights]);

    const onResetClickHandler = () => {
        const newSettings = Object.assign({}, settings);
        newSettings.updateSpeed = 25;
        newSettings.percentWalls = 30;
        newSettings.percentWeights = 20;

        onSettingsChanged(newSettings);
    }

    return (
        <Container>
            <Section>
                <TooltipHandle content={<>Set the time in <b>milliseconds</b> between updates to the board</>}>
                    <FontAwesomeIcon icon={faTachometerAlt} size="lg" />
                </TooltipHandle>
                <Input type="number" value={updateSpeed} onChange={e => setUpdateSpeed(e.target.value)} min="0" />
            </Section>
            <Section>
                <TooltipHandle content={<>Set the percentage of cells that are set to <b>walls</b> when randomised. Max <b>40%</b></>}>
                    <IconWithSecondary
                        icon={faMountain}
                        size="lg"
                        secondaryIcon={faDiceSix}
                    />
                </TooltipHandle>
                <Input type="number" value={pWalls} onChange={e => setPWalls(e.target.value)} min="0" max="40" />
            </Section>
            <Section>
                <TooltipHandle content={<>Set the percentage of cells that are set to <b>weights</b> when randomised. Max <b>40%</b></>}>
                    <IconWithSecondary
                        icon={faTree}
                        size="lg"
                        secondaryIcon={faDiceSix}
                    />
                </TooltipHandle>
                <Input type="number" value={pWeights} onChange={e => setPWeights(e.target.value)} min="0" max="40" />
            </Section>
            <ResetButton type="button" onClick={onResetClickHandler}>
                <FontAwesomeIcon icon={faUndo} />&nbsp;Reset Defaults
            </ResetButton>
        </Container>
    );
}

export default SettingsEditor;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: .5rem;
    color: #374151;
`

const Section = styled.div`
    align-items: center;

    display: grid;
    grid-template-columns: 40px auto;
`

const Input = styled.input`
    border-radius: 4px;
    padding: .5rem;
    border: 1px solid #D1D5DB;
    width: 100%;
    outline: none;
`

const InputInline = styled.div`
    display: flex; 
    gap: .5rem;
    justify-content: center;
`

const ResetButton = styled.button`
    padding: .5rem;
    border: none;
    cursor: pointer;
    background: #E4E6EA;
    border-radius: 4px;
    transition: background 300ms ease;

    &:hover {
        background: #D1D5DB;
    }
`
