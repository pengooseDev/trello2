import styled from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { toDoState } from "./atoms";
import { useRecoilState } from "recoil";
import Board from "./Components/Board";
import { useForm } from "react-hook-form";
import useSound from "use-sound";
import dragSound from "./assets/audio/drag.mp3";
import dropSound from "./assets/audio/drop.mp3";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 680px;
    width: 100%;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;

const Boards = styled.div`
    display: grid;
    width: 100%;
    gap: 10px;
    grid-template-columns: repeat(3, 1fr);
`;

const AddBoard = styled.form`
    background: rgba(13, 13, 13, 0.7);
    color: white;
    margin-bottom: 30px;
    padding: 15px 20px;
    border-radius: 5px;
`;

const AddBoardTitle = styled.div`
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 10px;
`;

const AddBoardInput = styled.input`
    border: none;
    padding: 5px;
    border-radius: 5px;
    :focus {
        border: none;
    }
    :active {
        border: none;
    }
`;

const AddBoardBtn = styled.button.attrs({ value: "Add" })`
    border: none;
    background: white;
    font-weight: 600;
    border-radius: 5px;
    transition: 0.2s ease-in-out;
    margin-left: 5px;
    height: 25px;

    :hover {
        background: #111;
        color: whitesmoke;
        cursor: pointer;
    }
`;

interface IAdd {
    add: string;
}

//DND 사용시 반드시 Strict 모드를 해제해줘야함.
//DND에서 id가 변하는 경우 반드시 key값과 draggableId를 동일하게 해줘야함.
//key를 Index로 한 경우 Complie Err 발생.
function App() {
    const [data, setData] = useRecoilState(toDoState);
    const [dragSFX] = useSound(dragSound, {});
    const [dropSFX] = useSound(dropSound);
    const { register, setValue, handleSubmit } = useForm<IAdd>();

    const onValid = ({ add }: IAdd) => {
        if (!add) {
            return;
        }
        setData((prev) => {
            return {
                ...prev,
                [add]: [],
            };
        });
        setValue("add", "");
    };

    const onDragEnd = (info: DropResult) => {
        console.log(info);
        dropSFX();
        const { destination, draggableId, source } = info;

        if (!destination) return;
        if (destination?.droppableId === source.droppableId) {
            //동일한 Board 내에 움직이는 경우.
            setData((prev) => {
                const copyArray = [...prev[source.droppableId]];
                const taskObj = copyArray[source.index];
                copyArray.splice(source.index, 1);
                copyArray.splice(destination?.index, 0, taskObj);

                return {
                    ...prev,
                    [source.droppableId]: copyArray,
                };
            });
        }

        if (destination.droppableId !== source.droppableId) {
            //다른 Board로 옮기는 경우.
            setData((prev) => {
                const sourceArray = [...prev[source.droppableId]];
                const taskObj = sourceArray[source.index];
                const destinationArray = [...prev[destination.droppableId]];
                sourceArray.splice(source.index, 1);
                destinationArray.splice(destination?.index, 0, taskObj);

                return {
                    ...prev,
                    [source.droppableId]: sourceArray,
                    [destination.droppableId]: destinationArray,
                };
            });
        }
    };

    return (
        <Wrapper>
            <AddBoard onSubmit={handleSubmit(onValid)}>
                <AddBoardTitle>Add Board!</AddBoardTitle>
                <AddBoardInput {...register("add")} />
                <AddBoardBtn>Add</AddBoardBtn>
            </AddBoard>
            <DragDropContext
                onDragStart={() => dragSFX()}
                onDragEnd={onDragEnd}
            >
                {/* DragDropContext는 Props으로 onDragEnd라는 Callback함수를 요구한다. */}
                <Boards>
                    {Object.keys(data).map((boardId) => (
                        <Board
                            boardId={boardId}
                            key={boardId}
                            toDos={data[boardId]}
                        />
                    ))}
                </Boards>
            </DragDropContext>
        </Wrapper>
    );
}
//Droppable 과 Draggable로 구분됨.

export default App;
