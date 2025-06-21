import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import {PlayerFooter} from "../components/PlayerFooter.tsx";
import { Sidebar } from "./Sidebar.tsx";

export const Layout = () => {
  return (
    <div className={"flex bg-[#F1F6F9] h-screen text-black"}>
      {/* Left Sidebar */}
      <Sidebar />
      <main
        className={
          "flex flex-col flex-1 relative my-0 mx-auto font-bold items-center justify-center"
        }
      >
        {/*<Navbar /> */}
        <Outlet />
        <PlayerFooter />
      </main>
      {/* Right Sidebar */}
      <aside className="w-100 border-l-2 border-black p-4">
        Sidebar Right
      </aside>
      <div id={"modal-root"} />
    </div>
  );
};
