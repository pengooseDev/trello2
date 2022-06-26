import { atom, selector } from "recoil";

export interface IToDo {
    id: number;
    text: string;
}

interface IToDoState {
    [key: string]: IToDo[];
}

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: {
        "To Do": [],
        Doing: [],
        Done: [],
    },
});

/*

export const minuteState = atom({
    key: "minutes",
    default: 0,
});

export const hourSelector = selector<number>({
    key: "hourSeletor",

    get: ({ get }) => {
        const minuteValue = get(minuteState);
        return minuteValue / 60;
    },

    //setHours로 설정한 값이 newValue로 들어옴
   
    set: ({ set }, newValue) => {
        const minutes = Number(newValue) * 60;
        set(minuteState, minutes);
    },
}); 

*/
