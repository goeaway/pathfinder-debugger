import { Algo } from "@src/types";
import React from "react";
import styled from "styled-components";
import algorithms from "../algorithms";


export interface MenuProps {
    onAlgorithmChange: (algo: Algo) => void;
}

const Menu : React.FC<MenuProps> = ({onAlgorithmChange}) => {
    const onAlgorithmTabClickHandler = (id: string) => {
        onAlgorithmChange(algorithms.find(a => a.id === id));
    }
    
    return (
        <Container>
            <TabContainer>
                {algorithms.map(a => (
                    <button key={a.id} onClick={() => onAlgorithmTabClickHandler(a.id)}>{a.name}</button>
                ))}
            </TabContainer>
            {/* Have settings button */}
        </Container>
    );
}

export default Menu;

const Container = styled.div`
    padding: 0 1rem;
    height: 100%;
`

const TabContainer = styled.div`

`




