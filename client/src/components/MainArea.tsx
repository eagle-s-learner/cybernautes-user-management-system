import { useEffect, useState } from "react";
import axios from "axios";
import NotificationPop from "../notificationPage/NotificationPop";
import ReactFlow, { Controls, Node, Edge, ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

interface Users {
    id: number;
    name: string;
    age: number;
    hobbies: string[];
}

interface Notify {
    notify: boolean;
    message: string;
}

export default function MainArea() {
    const [users, setUsers] = useState<Users[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [showNotification, setShowNotification] = useState<Notify>({
        notify: false,
        message: "",
    });

    const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<Users | null>(null);
    const [userName, setUserName] = useState<string>("");
    const [userAge, setUserAge] = useState<number>(0);
    const [userHobbies, setUserHobbies] = useState<string[]>([]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get<Users[]>(
                    "http://localhost:4500/api/users"
                );
                if (response.status === 200) {
                    setUsers(response.data);
                    setShowNotification({
                        notify: true,
                        message: "Users fetched successfully",
                    });
                    setLoading(false);
                }
            } catch (error) {
                setShowNotification({
                    notify: true,
                    message:
                        error.response?.data?.message || "Something went wrong",
                });
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    const handleEditUser = (user: Users) => {
        setSelectedUser(user);
        setUserName(user.name);
        setUserAge(user.age);
        setUserHobbies(user.hobbies);
        setEditFormVisible(true);
    };

    const handleUpdateUser = async () => {
        if (!userName || userAge <= 0) {
            setShowNotification({
                notify: true,
                message: "Please provide valid name and age.",
            });
            return;
        }

        try {
            const updatedUser = {
                ...selectedUser,
                name: userName,
                age: userAge,
                hobbies: userHobbies,
            };

            const response = await axios.put(
                `http://localhost:4500/api/users/${selectedUser?.id}`,
                updatedUser
            );

            if (response.status === 200) {
                setShowNotification({
                    notify: true,
                    message: `User ${updatedUser.name} updated successfully.`,
                });

                setEditFormVisible(false);
            }
        } catch (error) {
            setShowNotification({
                notify: true,
                message: "Failed to update user. Please try again.",
            });
        }
    };

    const handleCancelEdit = () => {
        setEditFormVisible(false);
    };

    const handleDeleteUser = async (user: Users) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${user.name}?`
        );
        if (!confirmed) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:4500/api/users/${user.id}`
            );
            if (response.status === 204) {
                setShowNotification({
                    notify: true,
                    message: `User ${user.name} deleted successfully`,
                });
                setUsers(users.filter((u) => u.id !== user.id)); // Remove user from list
            }
        } catch (error) {
            setShowNotification({
                notify: true,
                message:
                    error.response?.data?.message || "Failed to delete user",
            });
        }
    };

    useEffect(() => {
        if (users.length > 0) {
            const verticalSpacing = 250;
            const hobbySpacing = 80;

            const newNodes: Node[] = users.flatMap((user, userIndex) => {
                const userNodeY = 100 + userIndex * verticalSpacing;

                const userNode: Node = {
                    id: user.id.toString(),
                    data: {
                        label: (
                            <div className="flex flex-col p-4 bg-gray-100 border-2 border-gray-400 rounded-lg shadow-md w-80 h-40 overflow-y-auto">
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">
                                    {user.name} (Age: {user.age})
                                </h2>
                                <div className="flex justify-between mt-10">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditUser(user);
                                        }}
                                        className="px-4 py-1 text-black text-2xl font-bold rounded-md hover:underline focus:outline-none"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteUser(user);
                                        }}
                                        className="px-4 py-1 text-red-500 text-2xl font-bold rounded-md hover:underline focus:outline-none"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ),
                    },
                    position: { x: 200, y: userNodeY },
                    style: { width: 320, height: 180, pointerEvents: "auto" },
                    draggable: false,
                    selectable: false,
                };

                const hobbyNodes: Node[] = user.hobbies.map(
                    (hobby, hobbyIndex) => ({
                        id: `${user.id}-${hobbyIndex}-hobby`,
                        data: {
                            label: (
                                <div className="p-2 bg-green-100 border border-green-300 rounded-md text-center text-sm overflow-y-auto w-36 h-20">
                                    {hobby}
                                </div>
                            ),
                        },
                        position: {
                            x: 600,
                            y: userNodeY + hobbyIndex * hobbySpacing,
                        },
                        draggable: false,
                        selectable: false,
                    })
                );

                return [userNode, ...hobbyNodes];
            });

            const newEdges: Edge[] = users.flatMap((user) =>
                user.hobbies.map((_, hobbyIndex) => ({
                    id: `${user.id}-${hobbyIndex}`,
                    source: user.id.toString(),
                    target: `${user.id}-${hobbyIndex}-hobby`,
                    animated: true,
                    type: "smoothstep",
                }))
            );

            setNodes(newNodes);
            setEdges(newEdges);
        }
    }, [users]);

    if (loading) {
        return (
            <div className="text-center text-lg font-semibold">
                Loading users...
            </div>
        );
    }

    return (
        <div className="h-screen w-full ml-2">
            {showNotification.notify && (
                <NotificationPop
                    setShowNotification={setShowNotification}
                    message={showNotification.message}
                    onClose={() =>
                        setShowNotification({ notify: false, message: "" })
                    }
                />
            )}

            {editFormVisible && selectedUser && (
                <div className="fixed top-0 left-0 right-0 z-50 p-8 bg-white shadow-lg border-2 border-gray-500 rounded-md">
                    <h2 className="text-2xl font-bold mb-4">Edit User</h2>
                    <div>
                        <label className="block mb-2">Name:</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="border p-2 rounded-md w-full mb-4"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Age:</label>
                        <input
                            type="number"
                            value={userAge}
                            onChange={(e) => setUserAge(Number(e.target.value))}
                            className="border p-2 rounded-md w-full mb-4"
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Hobbies:</label>
                        <input
                            type="text"
                            value={userHobbies.join(", ")}
                            onChange={(e) =>
                                setUserHobbies(e.target.value.split(", "))
                            }
                            className="border p-2 rounded-md w-full mb-4"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            className="px-4 py-1 text-black text-2xl font-bold rounded-md hover:underline focus:outline-none"
                            onClick={handleUpdateUser}
                        >
                            Save Changes
                        </button>
                        <button
                            className="px-4 py-1 text-red-500 text-2xl font-bold rounded-md hover:underline focus:outline-none"
                            onClick={handleCancelEdit}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="h-screen w-full overflow-y-scroll">
                <ReactFlowProvider>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        panOnDrag
                        zoomOnScroll={false}
                        zoomOnPinch={false}
                        zoomOnDoubleClick={false}
                        fitView
                        fitViewOptions={{
                            padding: 0.2,
                            minZoom: 0.5,
                            maxZoom: 1,
                        }}
                    >
                        <Controls showZoom={false} showFitView={false} />
                    </ReactFlow>
                </ReactFlowProvider>
            </div>
        </div>
    );
}
