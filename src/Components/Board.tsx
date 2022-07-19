import { Droppable } from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { IToDo, toDoState } from "../atoms";
import { useRecoilState } from "recoil";

const Wrapper = styled.div`
    position: relative;
    padding: 10px;
    padding-top: 15px;
    background-color: ${(props) => props.theme.boardColor};
    border-radius: 5px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    text-align: center;
    font-weight: 600;
    font-size: 15px;
    padding: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: whitesmoke;
    border-radius: 3px;

    //Prevent to Dragging the text with CSS
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently*/
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

/* Form */
interface IForm {
    toDo: string;
}

interface IBoardProps {
    toDos: IToDo[];
    boardId: string;
}

const Form = styled.form`
    width: 100%;
    display: flex;
    padding: 5px 0px;
    &:first-child {
        background: teal;
    }
    input {
        width: 100%;
    }
`;

const Input = styled.input`
    border: none;
    border-radius: 2px;
    padding: 10px 5px;
    margin-right: 5px;
`;

const Btn = styled.button.attrs({ value: "Add" })`
    border: none;
    background: white;
    font-weight: 600;
    border-radius: 3px;
    transition: 0.2s ease-in-out;

    :hover {
        background: #111;
        color: whitesmoke;
        cursor: pointer;
    }
`;

const EraseBoard = styled.div`
    position: absolute;
    right: 2px;
    top: 2px;
    font-size: 10px;

    :hover {
        cursor: pointer;
    }
`;

const Board = ({ toDos, boardId }: IBoardProps) => {
    const [toDosData, setToDos] = useRecoilState(toDoState);
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const onValid = ({ toDo }: IForm) => {
        const newToDo = {
            id: Date.now(),
            text: toDo,
        };
        setToDos((prev) => {
            return {
                ...prev,
                [boardId]: [newToDo, ...prev[boardId]],
            };
        });
        setValue("toDo", "");
    };

    const boardEraseHandler = (e: any) => {
        const boardId = e.target.parentNode.firstChild.innerText;
        const newObj = { ...toDosData };
        delete newObj[boardId];
        setToDos((prev) => newObj);
    };

    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <EraseBoard onClick={boardEraseHandler}>❌</EraseBoard>
            <Form onSubmit={handleSubmit(onValid)}>
                <Input
                    {...register("toDo", { required: true })}
                    type="text"
                    placeholder={`Add task on ${boardId}`}
                />
                <Btn>Add</Btn>
            </Form>
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
                                key={toDo.id}
                                index={index}
                                toDoId={toDo.id}
                                toDoText={toDo.text}
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
