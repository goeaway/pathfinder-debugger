import { Cell } from "@src/types";
import React from "react";
import styled, { css } from "styled-components";

export interface CellProps {
    cell: Cell;
    selected?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

const DisplayCell: React.FC<CellProps> = ({cell, selected, onMouseEnter, onMouseLeave}) => {
    return (
        <Container 
            shortestPath={cell.shortestPath}
            checkCount={cell.checkCount}
            selected={selected} 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}>
            {/* Display Icon based on start/end/wall/weight */}
            {cell.type === "wall" && (
                <span>W</span>
            )}
            {cell.type === "start" && (
                <span>S</span>
            )}
            {cell.type === "end" && (
                <span>E</span>
            )}
        </Container>
    );
}

export default DisplayCell;

interface ContainerProps {
    selected?: boolean;
    checkCount?: number;
    shortestPath?: boolean;
}

const Container = styled.span`
    border: 1px solid black;
    width: 25px;
    height: 25px;
    background: white;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;

    ${(p: ContainerProps) => p.checkCount > 0 && !p.shortestPath && css`
        &:after {
            position: absolute;
            
            content: "";
            background: blue;
            border-radius: 50%;
            width: ${(p: ContainerProps) => p.checkCount * 10}px;
            height: ${(p: ContainerProps) => p.checkCount * 10}px;
        }
    `}

    ${(p: ContainerProps) => p.shortestPath && css`
        background: yellow;
    `}

    ${(p: ContainerProps) => p.selected && css`
        background: lightblue;
    `}

    > * {
        z-index: 2;
    }
`