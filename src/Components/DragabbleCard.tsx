import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import React from "react";
import { useRecoilState } from "recoil";
import { toDoState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
    position: relative;
    background: ${(props) =>
        props.isDragging ? "rgba(1,1,1,0.5)" : props.theme.cardColor};
    color: ${(props) =>
        props.isDragging ? "rgba(255, 255, 255, 0.5)" : "black"};
    padding: 10px;
    border-radius: 5px;
    font-weight: 600;
    margin: 5px;
    box-shadow: ${(props) => (props.isDragging ? "0px 0px 2px black" : "none")};
    transition: 0.2s ease-in-out;

    :hover {
        background: rgba(0, 0, 0, 0.2);
    }

    //Prevent to Dragging the text with CSS
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently*/
`;

const EraseCard = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.1);
    color: tomato;
    width: 15px;
    height: 36px;
    padding: 10px 10px 13px 10px;
    border-radius: 0px 5px 5px 0px;
    transition: 0.2s ease-in-out;

    :hover {
        pointer: cursor;
        background: tomato;
        color: black;
    }
`;

interface IDragabbleCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
}

const DragabbleCard = ({ toDoId, toDoText, index }: IDragabbleCardProps) => {
    const [toDos, setToDos] = useRecoilState(toDoState);

    const eraseHandler = (e: any) => {
        const target = e.currentTarget.parentNode?.firstChild.innerText;
        console.log(target);
        const boardId =
            e.currentTarget.parentNode?.parentNode?.parentNode?.firstChild
                .innerText;
        if (!boardId) {
            return;
        }

        setToDos((prev) => {
            let targetIndex = "";
            const newArray = [...toDos[boardId]];
            //@ts-ignore
            for (const [i, v] of newArray.entries()) {
                if (target === v["text"]) {
                    targetIndex = i;
                }
            }
            newArray.splice(Number(targetIndex), 1);

            return {
                ...prev,
                [boardId]: newArray,
            };
        });
    };

    return (
        <Draggable draggableId={toDoId + ""} index={index}>
            {(provided, snapshot) => (
                <Card
                    isDragging={snapshot.isDragging}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <div>{toDoText}</div>
                    <EraseCard onClick={eraseHandler}>x</EraseCard>
                </Card>
            )}
        </Draggable>
    );
};

//React.memo(functional Components) : prop이 변하지 않았다면 re-rendering 금지요청.
export default React.memo(DragabbleCard);
