import { faPlay, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cell } from "@src/types";
import React from "react";
import styled, { css } from "styled-components";

export interface CellProps {
    cell: Cell;
    selected?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    size: number;
}

const DisplayCell: React.FC<CellProps> = ({cell, selected, onMouseEnter, onMouseLeave, onClick, size}) => {
    return (
        <Container 
            size={size}
            shortestPath={cell.shortestPath}
            checkCount={cell.checkCount}
            selected={selected} 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}
            onClick={onClick} 
            wall={cell.type === "wall"}   
        >
            {/* Display Icon based on start/end/wall/weight */}
            {cell.type === "start" && (
                <span><FontAwesomeIcon color={"#065F46"} icon={faPlay} /></span>
            )}
            {cell.type === "end" && (
                <span><FontAwesomeIcon color={"#FCD34D"} icon={faStar} /></span>
            )}
        </Container>
    );
}

export default DisplayCell;

interface ContainerProps {
    selected?: boolean;
    checkCount?: number;
    shortestPath?: boolean;
    wall?: boolean;
    size: number;
}

const Container = styled.span`
    width: ${(p: ContainerProps) => p.size}px;
    height: ${(p: ContainerProps) => p.size}px;
    background: #F3F4F6;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
    border: 1px solid #1F2937;

    ${(p: ContainerProps) => p.checkCount > 0 && !p.shortestPath && css`
        &:after {
            position: absolute;
            
            content: "";
            background: #2563EB;
            border-radius: 50%;
            width: ${(p: ContainerProps) => p.checkCount * 10}px;
            height: ${(p: ContainerProps) => p.checkCount * 10}px;
        }
    `}

    ${(p: ContainerProps) => p.shortestPath && css`
        background: #FEF3C7;
    `}

    ${(p: ContainerProps) => p.selected && css`
        background: #BFDBFE;
    `}

    ${(p: ContainerProps) => p.wall && css`
        background: #111827;
    `}

    > * {
        z-index: 2;
    }
`