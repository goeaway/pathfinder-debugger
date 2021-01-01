import { faFeatherAlt, faPen, faWeightHanging } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Algo, AlgoType } from "@src/types";
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

    const getIconForType = (type: AlgoType) => {
        switch (type) {
            case "custom":
                return faPen;
            case "weighted":
                return faWeightHanging;
            case "unweighted":
                return faFeatherAlt;
        }
    }
    
    return (
        <Container>
            <TabContainer>
                {algorithms.map(a => (
                    <Button key={a.id} onClick={() => onAlgorithmTabClickHandler(a.id)}>
                        <FontAwesomeIcon icon={getIconForType(a.type)} />&nbsp;
                        {a.name}
                    </Button>
                ))}
            </TabContainer>
            {/* Have settings button */}
        </Container>
    );
}

export default Menu;

const Container = styled.div`
    @media(min-width:${p => p.theme.breakpoints.sm}px) {
        height: 100%;
        padding-right: .5rem;
    }
`

const TabContainer = styled.div`
    display: flex;
    gap: .5rem;
    margin-bottom: .5rem;

    @media(min-width:${p => p.theme.breakpoints.sm}px) {
        flex-direction: column;
        margin-bottom: 0;
    }
`

const Button = styled.button`
    padding: .5rem;
    cursor: pointer;
    border-radius: 4px;
    border: none;
    color: white;
    font-size: 16px;

    background: rgb(59,130,246);
    background: linear-gradient(126deg, rgba(59,130,246,1) 0%, rgba(29,78,216,1) 100%);

    &:hover {
        background: linear-gradient(346deg, rgba(59,130,246,1) 0%, rgba(29,78,216,1) 100%);
    }

    @media(min-width:${p => p.theme.breakpoints.sm}px) {
        width: 100%;
    }
`




