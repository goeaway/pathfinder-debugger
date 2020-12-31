import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";
import styled from "styled-components";

export interface IconButtonProps {
    icon: IconProp;
    onClick: () => void;
    title?: string;
}

const IconButton : FC<IconButtonProps> = ({icon, onClick, title}) => {
    return (
        <Button onClick={onClick} title={title} aria-label={title}>
            <FontAwesomeIcon icon={icon} size="lg" />
        </Button>
    );
}

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
    
    &:hover {
        background: #D1D5DB;
    }
`
