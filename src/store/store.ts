import { configureStore } from "@reduxjs/toolkit";
import musicReducer from "../store/slices/musicSlice"
import todoReducer from "./slices/todoSlice"

export const store = configureStore({
    reducer: {
        music: musicReducer,
        todo: todoReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
