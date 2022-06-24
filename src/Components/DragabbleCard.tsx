import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import React from "react";

const Card = styled.div`
    background: ${(props) => props.theme.cardColor};
    padding: 10px;
    border-radius: 5px;
    font-weight: 600;
    margin: 5px;
`;

interface IDraggable {
    toDo: string;
    index: number;
}

const DragabbleCard = ({ toDo, index }: IDraggable) => {
    console.log(toDo, "has been rendered");
    return (
        <Draggable key={toDo} draggableId={toDo} index={index}>
            {(provided) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    {toDo}
                </Card>
            )}
        </Draggable>
    );
};

//React.memo(functional Components) : prop이 변하지 않았다면 re-rendering 금지요청.
export default React.memo(DragabbleCard);
