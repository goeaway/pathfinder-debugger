import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MutableRefObject } from "react";
import { FC } from "react";
import styled from "styled-components";

export interface TooltipProps {
    show: boolean;
}

const Tooltip : FC<TooltipProps> = ({show, children}) => {
    const [offset, setOffset] = useState<{top: number, left: number}>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const variants = {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        }
    }

    // detect if about to go off screen
    useLayoutEffect(() => { 
        const handler = (event: MouseEvent) => {
            if(show && containerRef && containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                const { x, y } = event;

                const xOffset = 20;
                const yOffset = 20;

                let finalLeft = x + xOffset;
                let finalTop = y + yOffset;

                // put the tooltip to the left of the mouse instead of right
                if(finalLeft + width >= (window.innerWidth || document.documentElement.clientWidth)) {
                    // final left is right - width - xOffset
                    finalLeft = x - width - xOffset;
                }

                // put the tooltip above the mouse instead of below
                if(finalTop + height >= (window.innerHeight || document.documentElement.clientHeight)) {
                    finalTop = y - height - yOffset;
                }

                setOffset({left: finalLeft, top: finalTop});
            }
        }
        // find current mouse pos

        window.addEventListener("mousemove", handler);

        return () => {
            window.removeEventListener("mousemove", handler)
        }
    }, [show, containerRef]);

    return (
        <AnimatePresence>
            {show && (
                <Container
                    ref={containerRef}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="initial"
                    top={offset?.top}
                    left={offset?.left}
                >
                    {children}
                </Container>        
            )}
        </AnimatePresence>
    )
};

export default Tooltip;

interface ContainerProps {
    top: number;
    left: number;
}

const Container = styled(motion.div)`
    position: absolute;
    z-index: 9999;
    background: #F3F4F6;
    border-radius: 6px;
    padding: .5rem;

    box-shadow:
  0 1.3px 2.2px rgba(0, 0, 0, 0.02),
  0 3.1px 5.3px rgba(0, 0, 0, 0.028),
  0 5.9px 10px rgba(0, 0, 0, 0.035),
  0 10.5px 17.9px rgba(0, 0, 0, 0.042),
  0 19.6px 33.4px rgba(0, 0, 0, 0.05),
  0 47px 80px rgba(0, 0, 0, 0.07)
;

    top: ${(p: ContainerProps) => p.top}px;
    left: ${(p: ContainerProps) => p.left}px;
`