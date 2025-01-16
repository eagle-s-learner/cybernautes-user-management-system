import MainArea from "./components/MainArea"
import SideBar from "./components/SideBar"

function App() {

  return (
    <>
      <div className="sticky top-0 mx-auto bg-slate-400">
        <h1 className="text-2xl w-fit mx-auto font-semibold p-2">User Mangement System</h1>
        <button className="absolute top-1 p-2 hover:underline right-2">Create User</button>
      </div>
      <div className="flex">
        <SideBar />
        <MainArea />
      </div>
    </>
  )
}

export default App
