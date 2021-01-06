import useTooltip from "@src/hooks/use-tooltip";
import React, { FC, useRef } from "react";
import { ReactNode } from "react";
import styled from "styled-components";

export interface TooltipHandleProps {
    content: ReactNode;
}

const TooltipHandle : FC<TooltipHandleProps> = ({content, children}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { showTooltip, hideTooltip } = useTooltip();

    return (
        <Container ref={ref} onMouseOver={() => showTooltip(ref, content, { showDelay: 500 })} onMouseLeave={() => hideTooltip(ref)}>
            {children}
        </Container>
    )
}

export default TooltipHandle;

const Container = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: center;
`