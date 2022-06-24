import { Droppable } from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard";
import styled from "styled-components";

const Wrapper = styled.div`
    padding: 10px;
    padding-top: 15px;
    background-color: ${(props) => props.theme.boardColor};
    border-radius: 5px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
`;

interface IBoardProps {
    toDos: string[];
    boardId: string;
}

const Title = styled.div`
    text-align: center;
    font-weight: 600;
    font-size: 15px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: whitesmoke;
    border-radius: 3px;
`;

interface IInfo {
    isDraggingOver: boolean;
    isDraggingFromThis: boolean;
}
const Area = styled.div<IInfo>`
    background: rgba(0, 0, 0, 0.3);
    background: ${(props) =>
        props.isDraggingOver
            ? "#0398C2"
            : props.isDraggingFromThis
            ? "rgba(0,0,0,0.05)"
            : "rgba(0,0,0,0.2)"};
    padding: 3px;
    border-radius: 3px;
    margin-top: 10px;
    flex-grow: 1;
    transition: 0.15s ease-in-out;
`;

const Board = ({ toDos, boardId }: IBoardProps) => {
    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Droppable droppableId={boardId}>
                {/*snapshot의 prop에 isDragOver은 드래그하고 있는게 현재 Droppable에 왔는지 확인 가능. */}
                {(provided, info) => (
                    <Area
                        isDraggingOver={info.isDraggingOver}
                        isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {toDos.map((toDo, index) => (
                            <DragabbleCard
                                key={toDo}
                                index={index}
                                toDo={toDo}
                            />
                        ))}
                        {provided.placeholder}
                    </Area>
                )}
            </Droppable>
        </Wrapper>
    );
};

export default Board;
