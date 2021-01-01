import { faCampground, faHiking, faMountain, faPlay, faStar, faTree } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cell } from "@src/types";
import React, { ForwardedRef } from "react";
import { MutableRefObject } from "react";
import styled, { css } from "styled-components";

export interface CellProps {
    cell: Cell;
    selected?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    size: number;
    ref?: ForwardedRef<HTMLDivElement>;
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
        >
            {/* Display Icon based on start/end/wall/weight */}
            {cell.type === "start" && (
                <span><FontAwesomeIcon color="#065F46" size="lg" icon={faHiking} /></span>
            )}
            {cell.type === "end" && (
                <span><FontAwesomeIcon color="#374151" icon={faCampground} /></span>
            )}
            {cell.type === "wall" && (
                <span><FontAwesomeIcon color="#374151" icon={faMountain} size="lg" /></span>
            )}
            {cell.type === "weight" && (
                <span><FontAwesomeIcon color="#065F46" icon={faTree} size="lg" /></span>
            )}
        </Container>
    );
};

export default DisplayCell;

interface ContainerProps {
    selected?: boolean;
    checkCount?: number;
    shortestPath?: boolean;
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

    > * {
        z-index: 2;
    }
`