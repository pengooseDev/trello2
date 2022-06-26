import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import React from "react";

const Card = styled.div<{ isDragging: boolean }>`
    background: ${(props) =>
        props.isDragging ? "rgba(1,1,1,0.5)" : props.theme.cardColor};
    color: ${(props) =>
        props.isDragging ? "rgba(255, 255, 255, 0.5)" : "black"};
    padding: 10px;
    border-radius: 5px;
    font-weight: 600;
    margin: 5px;
    box-shadow: ${(props) =>
        props.isDragging ? "0px 0px 10px black" : "none"};
    transition: 0.2s ease-in-out;

    //Prevent to Dragging the text with CSS
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently*/
`;

interface IDragabbleCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
}

const DragabbleCard = ({ toDoId, toDoText, index }: IDragabbleCardProps) => {
    console.log(toDoText, "has been rendered");
    return (
        <Draggable draggableId={toDoId + ""} index={index}>
            {(provided, snapshot) => (
                <Card
                    isDragging={snapshot.isDragging}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {toDoText}
                </Card>
            )}
        </Draggable>
    );
};

//React.memo(functional Components) : prop이 변하지 않았다면 re-rendering 금지요청.
export default React.memo(DragabbleCard);
