import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import React, { FC, MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import TooltipContext from "@src/context/tooltip-context";

const Tooltip : FC = ({children}) => {
    const [tooltip, setTooltip] = useState<{handle: MutableRefObject<HTMLElement>, content: any}>(null);

    const showTooltip = (handle: MutableRefObject<HTMLElement>, content: any) =>{
        setTooltip({ handle, content });
    } 

    const hideTooltip = (handle: MutableRefObject<HTMLElement>) => setTooltip(null);

    const [show, setShow] = useState(false);
    const [offset, setOffset] = useState<{top: number, left: number}>({top:0, left: 0});
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(tooltip) {
            const timeout = setTimeout(() => {
                setShow(true);
            }, 500);

            return () => clearTimeout(timeout);
        } else {
            setShow(false);
        }
    }, [tooltip]);

    useLayoutEffect(() => {
        if(!tooltip || !show) {
            return;
        }

        const { handle } = tooltip;

        if(handle && handle.current && containerRef && containerRef.current) {
            // place the tooltip below the handle
            const { bottom, left, width: handleWidth } = handle.current.getBoundingClientRect();
            const { width: containerWidth } = containerRef.current.getBoundingClientRect();

            const containerTop = bottom + 10;
            const containerLeft = left + (handleWidth /2) - (containerWidth /2);
            setOffset({top: containerTop, left: containerLeft});
        }
    }, [tooltip, containerRef, show]);

    const variants = {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        }
    }

    return (
        <TooltipContext.Provider value={{showTooltip, hideTooltip}}>
            <AnimatePresence>
                {show && tooltip && (
                    <Container
                        ref={containerRef}
                        variants={variants}
                        initial="initial"
                        animate="animate"
                        exit="initial"
                        top={offset.top}
                        left={offset.left}
                    >
                        {tooltip.content}
                    </Container>
                )}
            </AnimatePresence>
            {children}
        </TooltipContext.Provider>
    )
}

export default Tooltip;

interface ContainerProps {
    top: number;
    left: number;
}

const Container = styled(motion.div)`
    position: absolute;
    top: ${(p: ContainerProps) => p.top}px;
    left: ${(p: ContainerProps) => p.left}px;
    border-radius: 6px;
    padding: .25rem .45rem;
    z-index: 9999;
    background: #F3F4F6;
    font-size: 14px;
    color: #6B7280;
    max-width: 250px;
    text-align: center;

    box-shadow:
  0 1.3px 2.2px rgba(0, 0, 0, 0.02),
  0 3.1px 5.3px rgba(0, 0, 0, 0.028),
  0 5.9px 10px rgba(0, 0, 0, 0.035),
  0 10.5px 17.9px rgba(0, 0, 0, 0.042),
  0 19.6px 33.4px rgba(0, 0, 0, 0.05),
  0 47px 80px rgba(0, 0, 0, 0.07)
;
`