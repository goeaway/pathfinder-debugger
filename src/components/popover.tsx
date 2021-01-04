import React, { useLayoutEffect, useRef, useState } from "react";
import { MutableRefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled, { css } from "styled-components"
import useOutsideClick from "@src/hooks/use-outside-click";
import { FC } from "react";
import { PopoverPosition } from "@src/types";

export interface PopoverProps {
    show?: boolean;
    onDismissed?: () => void;
    handle?: MutableRefObject<HTMLElement>;
    position?: PopoverPosition;
}

const Popover : FC<PopoverProps> = ({show, onDismissed, handle, children, position}) => {
    const [offset, setOffset] = useState<{top: number, left: number}>({top:0,left:0});
    const containerRef = useRef<HTMLDivElement>(null);
    useOutsideClick([containerRef, handle], onDismissed);

    // find the handle and move the popover to it
    useLayoutEffect(() => {
        const listener = () => {
            if(show && handle && handle.current && containerRef && containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                const { top, left, bottom, right } = handle.current.getBoundingClientRect();
    
                let finalTop = top;
                let finalLeft = left;
                // set the top and left of the popover based on the position
                switch(position) {
                    case "bottom":
                        break;
                    case "bottomleft":
                        finalTop = bottom + 10;
                        finalLeft = right - width;
                        break;
                    case "bottomright":
                        break;
                }
    
                if(finalTop < 0) {
                    finalTop = 20;
                }
    
                if(finalLeft < 0) {
                    finalLeft = 20;
                }
    
                setOffset({top: finalTop, left: finalLeft});
            }
        }

        listener();

        window.addEventListener("resize", listener);

        return () => window.removeEventListener("resize", listener);
    }, [show, handle, containerRef]);

    const variants = {
        initial: {
            opacity: 0,
            rotateX: -10,
            transformPerspective: "1000px"
        },
        animate: {
            opacity: 1,
            rotateX: 0,
            transformPerspective: "1000px"
        }
    }

    return (
        <AnimatePresence>
            {show && (
                <Container 
                    top={offset.top}
                    left={offset.left}
                    ref={containerRef}
                    initial="initial"
                    animate="animate"
                    exit="initial"
                    variants={variants}
                    style={{originY: 0}}
                >
                    {children}
                </Container>
            )}
        </AnimatePresence>
    )
};

export default Popover;

interface ContainerProps {
    top: number;
    left: number;
}

const Container = styled(motion.div)`
    position: absolute;
    z-index: 1000;
    border-radius: 6px;
    max-width: 400px;
    padding: 1rem;
    background: #F3F4F6;
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