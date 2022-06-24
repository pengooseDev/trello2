import styled from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { toDoState } from "./atoms";
import { useRecoilState } from "recoil";
import Board from "./Components/Board";
import useSound from "use-sound";

import dragSound from "./assets/audio/drag.mp3";
import dropSound from "./assets/audio/drop.mp3";

const Wrapper = styled.div`
    display: flex;
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

//DND 사용시 반드시 Strict 모드를 해제해줘야함.
//DND에서 id가 변하는 경우 반드시 key값과 draggableId를 동일하게 해줘야함.
//key를 Index로 한 경우 버그 발생.
function App() {
    const [data, setData] = useRecoilState(toDoState);
    const [dragSFX] = useSound(dragSound, {});
    const [dropSFX] = useSound(dropSound);

    const onDragEnd = (info: DropResult) => {
        console.log(info);
        dropSFX();
        const { destination, draggableId, source } = info;
        if (!destination) return;
        if (destination?.droppableId === source.droppableId) {
            //동일한 Board 내에 움직이는 경우.
            setData((prev) => {
                const copyArray = [...prev[source.droppableId]];
                copyArray.splice(source.index, 1);
                copyArray.splice(destination?.index, 0, draggableId);

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
                const destinationArray = [...prev[destination.droppableId]];
                const sourceIndex = source.index;
                const destinationIndex = destination.index;

                const targetValue = sourceArray.splice(sourceIndex, 1);
                destinationArray.splice(destinationIndex, 0, targetValue[0]);

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
