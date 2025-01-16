import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setSearchQuery, resetSearch } from "../../store/hobbiesSlice";

export default function SideBar() {
    const dispatch = useDispatch();
    const { allHobbies, filteredHobbies, searchQuery } = useSelector(
        (state: RootState) => state.hobbies
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchQuery(e.target.value));
    };

    const handleFocus = () => {
        dispatch(resetSearch());
    };

    const handleBlur = () => {
        if (searchQuery === "") {
            dispatch(resetSearch());
        }
    };

    // const onDragStart = (event: React.DragEvent, hobby: string) => {
    //     event.dataTransfer.setData("application/reactflow", hobby);
    //     event.dataTransfer.effectAllowed = "move";
    // };

    const hobbiesToShow = searchQuery ? filteredHobbies : allHobbies;

    return (
        <div className="w-64 bg-gray-100 p-4">
            <h2 className="text-lg font-semibold mb-4">Hobbies</h2>
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="Search hobbies..."
                className="w-full p-2 border rounded mb-4"
            />
            {hobbiesToShow.map((hobby, index) => (
                <div
                    key={index}
                    draggable
                    // onDragStart={(e) => onDragStart(e, hobby)}
                    className="bg-blue-200 p-2 mt-2 rounded cursor-grab hover:bg-blue-300"
                >
                    {hobby}
                </div>
            ))}
        </div>
    );
}
