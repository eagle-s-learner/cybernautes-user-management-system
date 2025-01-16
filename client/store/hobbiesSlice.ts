import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HobbiesState {
    allHobbies: string[];
    filteredHobbies: string[];
    searchQuery: string;
}

const initialState: HobbiesState = {
    allHobbies: ["Cricket", "Football", "Reading", "Cooking", "Traveling", "Coding", "Sleeping"],
    filteredHobbies: [],
    searchQuery: "",
};

const hobbiesSlice = createSlice({
    name: "hobbies",
    initialState,
    reducers: {
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
            if (action.payload.trim() === "") {
                state.filteredHobbies = [];
            } else {
                state.filteredHobbies = state.allHobbies.filter((hobby) =>
                    hobby.toLowerCase().includes(action.payload.toLowerCase())
                );
            }
        },
        resetSearch(state) {
            state.allHobbies = ["Cricket", "Football", "Reading", "Cooking", "Traveling", "Coding", "Sleeping"];
            state.searchQuery = "";
            state.filteredHobbies = [];
        },
    },
});

export const { setSearchQuery, resetSearch } = hobbiesSlice.actions;
export default hobbiesSlice.reducer;
