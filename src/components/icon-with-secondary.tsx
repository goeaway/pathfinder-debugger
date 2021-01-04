import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import React from "react";
import { FC } from "react";
import styled from "styled-components";

export interface IconWithSecondaryProps {
    icon: IconProp;
    secondaryIcon?: IconProp;
}

const IconWithSecondary : FC<IconWithSecondaryProps & FontAwesomeIconProps> = ({icon, secondaryIcon, ...rest}) => {
    return (
        <Container>
            <FontAwesomeIcon icon={icon} {...rest} />
            {secondaryIcon && <FontAwesomeIcon className="secondary-icon" icon={secondaryIcon} size="xs" />}
        </Container>
    );
};

export default IconWithSecondary;

const Container = styled.div`
    position: relative;

    .secondary-icon {
        position: absolute;
        top: -4px;
        right: -4px;
        z-index: 1;
    }
`
