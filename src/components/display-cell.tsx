import { faCampground, faHiking, faMapMarkerAlt, faMountain, faPlay, faRoute, faSearch, faStar, faTree } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useTooltip from "@src/hooks/use-tooltip";
import { Cell } from "@src/types";
import getTypeDescription from "@src/utils/get-type-description";
import getTypeIcon from "@src/utils/get-type-icon";
import React, { ForwardedRef, useEffect, useLayoutEffect, useRef, useState } from "react";
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
    const { showTooltip, hideTooltip } = useTooltip();
    const containerRef = useRef<HTMLDivElement>(null);
    const [startTooltipCountdown, setStartTooltipCountdown] = useState(false);

    useLayoutEffect(() => {
        if(startTooltipCountdown) {
            const timeout = setTimeout(() => {
                showTooltip(containerRef, 
                    <TooltipContent>
                        <div>
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> {cell.pos.x}, {cell.pos.y}
                        </div>
                        {cell.type && (
                            <div>
                                <FontAwesomeIcon icon={getTypeIcon(cell.type)} /> {getTypeDescription(cell.type)}
                            </div>
                        )}
                        {cell.checkCount && (
                            <div>
                                <FontAwesomeIcon icon={faSearch} /> Cell was checked {cell.checkCount} time{cell.checkCount !== 1 ? "s" : ""}
                            </div>
                        )}
                        {cell.shortestPath && ["start", "end"].indexOf(cell.type) === -1 && cell.type !== "end" && (
                            <div>
                                <FontAwesomeIcon icon={faRoute} /> Cell is part of the shortest path
                            </div>
                        )}
                    </TooltipContent>,
                    {
                        offsetCalculator: (tooltipWidth, tooltipHeight) => {
                            const { bottom, right, left, top } = containerRef.current.getBoundingClientRect();
        
                            const offset = 5;
        
                            let finalLeft = right + offset;
                            let finalTop = bottom + offset;
        
                            // if tooltip is going to go off screen, fix it by setting it so the right edge of the tooltip is near the left edge of the cell
                            if(finalLeft + tooltipWidth >= (window.innerWidth || document.documentElement.clientWidth)) {
                                // final left is right - width - xOffset
                                finalLeft = left - tooltipWidth - offset;
                            }
            
                            // put the tooltip above the mouse instead of below
                            if(finalTop + tooltipHeight >= (window.innerHeight || document.documentElement.clientHeight)) {
                                finalTop = top - tooltipHeight - offset;
                            }
                            return { top: finalTop, left: finalLeft };
                        }
                    }
                );
            }, 500);

            return () => clearTimeout(timeout);
        } else {
            hideTooltip(containerRef);
        }
    }, [startTooltipCountdown]);

    useEffect(() => {
        if(selected) {
            setStartTooltipCountdown(true);
        } else {
            setStartTooltipCountdown(false);
        }
    }, [selected]);
    
    return (
        <Container 
            ref={containerRef}
            size={size}
            shortestPath={cell.shortestPath}
            checkCount={cell.checkCount}
            selected={selected} 
            onMouseEnter={onMouseEnter} 
            onMouseLeave={onMouseLeave}
            onClick={onClick} 
            pulse={["start", "end"].indexOf(cell.type) > -1}
        >
            {/* Display Icon based on start/end/wall/weight */}
            {cell.type === "start" && (
                <span><FontAwesomeIcon color="#374151" size="lg" icon={faHiking} /></span>
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
    pulse?: boolean;
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
        &:before {
            position: absolute;
            content: "";
            background: green;
            opacity: .3;
            border-radius: 50%;
            transition: width 300ms, height 300ms;
            width: ${(p: ContainerProps) => p.checkCount * 10}px;
            height: ${(p: ContainerProps) => p.checkCount * 10}px;
        }
    `}

    ${(p: ContainerProps) => p.pulse && css`
        &:before {
            position: absolute;
            content: "";
            border-radius: 50%;
            width: 1px;
            height: 1px;
            animation: pulse 2s infinite;
            box-shadow: 0 0 0 rgba(0,255,0, 0.7);
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

const TooltipContent = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 14px;
    gap: 5px;
    max-width: 200px;
    color: #374151;
`