import { useState } from "react";
import MainArea from "./components/MainArea";
import SideBar from "./components/SideBar";
import UserCreatePage from "./pages/UserCreatePage";

function App() {
    const [showUserCreatePage, setShowUserCreatePage] = useState(false);

    function handleShowUserCreatePage() {
        setShowUserCreatePage((prev) => !prev);
    }

    return (
        <>
            <div className="sticky top-0 mx-auto bg-slate-400">
                <h1 className="text-2xl w-fit mx-auto font-semibold p-2">
                    User Mangement System
                </h1>
                <button
                    onClick={handleShowUserCreatePage}
                    className="absolute top-1 p-2 hover:underline right-2"
                >
                    Create User
                </button>
            </div>
            {showUserCreatePage && <UserCreatePage handleShowUserCreatePage={handleShowUserCreatePage}/>}
            <div className="flex">
                <SideBar />
                <MainArea />
            </div>
        </>
    );
}

export default App;
