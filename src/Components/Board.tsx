import { Droppable } from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard";
import styled from "styled-components";

const Wrapper = styled.div`
    padding: 10px;
    padding-top: 15px;
    background-color: ${(props) => props.theme.boardColor};
    border-radius: 5px;
    min-height: 200px;
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

const WrapDiv = styled.div`
    background: rgba(0, 0, 0, 0.3);
    padding: 3px;
    border-radius: 3px;
`;
const Board = ({ toDos, boardId }: IBoardProps) => {
    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Droppable droppableId={boardId}>
                {(provided) => (
                    <Wrapper
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <WrapDiv>
                            {toDos.map((toDo, index) => (
                                <DragabbleCard
                                    key={toDo}
                                    index={index}
                                    toDo={toDo}
                                />
                            ))}
                            {provided.placeholder}
                        </WrapDiv>
                    </Wrapper>
                )}
            </Droppable>
        </Wrapper>
    );
};

export default Board;
