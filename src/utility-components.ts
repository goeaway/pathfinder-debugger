import styled from "styled-components";

export const HiddenSm = styled.span`
    @media(max-width:${p => p.theme.breakpoints.md}px) {
        display: none;
    }
`