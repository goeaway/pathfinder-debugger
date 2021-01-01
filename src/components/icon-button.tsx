import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC, ForwardedRef } from "react";
import styled from "styled-components";

export interface IconButtonProps {
    icon: IconProp;
    ref?: ForwardedRef<HTMLButtonElement>;
    secondaryIcon?: IconProp;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(({icon, secondaryIcon, ...rest}, ref) => (
    <Button {...rest} ref={ref}>
        <FontAwesomeIcon icon={icon} size="lg" />
        {secondaryIcon && <FontAwesomeIcon className="secondary-icon" icon={secondaryIcon} size="xs" />}
    </Button>
));

export default IconButton;

const Button = styled.button`
    outline: none;
    border: none;
    background: #E5E7EB;
    color: #6B7280;
    border-radius: 50%;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background 300ms ease;
    position: relative;

    &:hover {
        background: #D1D5DB;
    }

    .secondary-icon {
        position: absolute;
        top: 7px;
        right: 7px;
        z-index: 1;
    }
`
