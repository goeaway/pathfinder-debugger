import { faHiking, faCampground, faMountain, faTree } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getTypeDescription from "@src/utils/get-type-description";
import React, { FC } from "react";
import styled from "styled-components";

const Help : FC = () => {
    return (
        <Container>
            <HelpText>
                Add a Start, End, Walls and Weights to the board.
            </HelpText>
            <HelpText>
                Then Run the algorithm of your choice and see how it performs.
            </HelpText>
            <HelpText>
                Start&nbsp;<FontAwesomeIcon icon={faHiking} />
            </HelpText>
            <HelpTextSmall>
                {getTypeDescription("start")}. Press <b>S</b> while selecting a cell to add.    
            </HelpTextSmall>
            <HelpText>
                End&nbsp;<FontAwesomeIcon icon={faCampground} />
            </HelpText>
            <HelpTextSmall>
                {getTypeDescription("end")}. Press <b>E</b> while selecting a cell to add.
            </HelpTextSmall>
            <HelpText>
                Wall&nbsp;<FontAwesomeIcon icon={faMountain} />
            </HelpText>
            <HelpTextSmall>
                {getTypeDescription("wall")}. Press <b>W</b> while selecting a cell to add.
            </HelpTextSmall>
            <HelpText>
                Weight&nbsp;<FontAwesomeIcon icon={faTree} />
            </HelpText>
            <HelpTextSmall>
                {getTypeDescription("weight")}. Press <b>Q</b> while selecting a cell to add.
            </HelpTextSmall>
        </Container>
    )
}

export default Help;

const Container = styled.div`
    display: flex;
    flex-direction: column;
`

const HelpText = styled.p`
    display: flex;
    margin: .5rem 0;
`

const HelpTextSmall = styled.p`
    margin: 0;
    margin-bottom: .5rem;
    font-size: 14px;
    color: #6B7280;
`