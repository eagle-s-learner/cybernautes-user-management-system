import axios from "axios";
import { useState } from "react";
import NotificationPop from "../notificationPage/NotificationPop";

interface Notify {
    notify: boolean;
    message: string;
}

export default function UserCreatePage({
    handleShowUserCreatePage,
}: {
    handleShowUserCreatePage: () => void;
}) {
    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const [showNotification, setShowNotification] = useState<Notify>({
        notify: false,
        message: "",
    });

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // Handle key press (Enter)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            setHobbies((prevHobbies) => [...prevHobbies, inputValue.trim()]);
            setInputValue("");
        }
    };

    async function handleCreateUser(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        try {
            // const formData = new FormData();
            // formData.append("name", name);
            // formData.append("age", age.toString());
            // formData.append("hobbies", JSON.stringify(hobbies));
            const user = {
                name,
                age,
                hobbies,
            };

            const response = await axios.post(
                "http://localhost:4500/api/users/",
                user,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status == 201) {
                setShowNotification({
                    notify: true,
                    message:
                        response.data.message || "User created successfully",
                });
                setAge(0);
                setHobbies([]);
                setName("");
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            // console.log(error)
            setShowNotification({
                notify: true,
                message:
                    error.response?.data?.message || "Something went wrong",
            });
        }
    }

    return (
        <div
            className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleShowUserCreatePage}
        >
            {/* show notification on error or success */}
            {showNotification.notify && (
                <NotificationPop
                    setShowNotification={setShowNotification}
                    message={showNotification.message}
                    onClose={() =>
                        setShowNotification({ notify: false, message: "" })
                    }
                />
            )}

            <div
                className="w-1/2 bg-gray-500 rounded-md p-3 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Create New User</h1>
                    <button
                        onClick={handleShowUserCreatePage}
                        className="text-gray-200 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
                <hr />

                {/* all input field */}
                <label>Enter Your Name</label>
                <input
                    className="block mb-2 w-72 p-2 bg-slate-300"
                    placeholder="Enter your name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>Enter Your Age</label>
                <input
                    className="block mb-2 w-72 p-2 bg-slate-300"
                    placeholder="Enter your age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                />
                <label>Enter Your Hobbies</label>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your hobby and press Enter"
                    className="border border-gray-300 px-3 py-2 rounded w-full mb-4"
                />

                {/* only show in there is hobbies in the array */}
                {hobbies.length > 0 && (
                    <div>
                        <label className="mb-2">Your Hobbies:</label>
                        <ul className="list-disc pl-5">
                            {hobbies.map((hobby, index) => (
                                <li key={index}>{hobby}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    onClick={handleCreateUser}
                    className="px-3 py-2 text-red-600 hover:underline"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
