import { configureStore } from "@reduxjs/toolkit";
import hobbiesSlice from "./hobbiesSlice";

export const store = configureStore({
    reducer : {
        hobbies :hobbiesSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;