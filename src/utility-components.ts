import styled from "styled-components";

export const HiddenXs = styled.span`
    @media(max-width:${p => p.theme.breakpoints.sm}px) {
        display: none;
    }
`