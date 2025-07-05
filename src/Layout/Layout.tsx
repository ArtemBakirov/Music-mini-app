import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { PlayerFooter } from "../components/PlayerFooter.tsx";
import { Sidebar } from "./Sidebar.tsx";
import { Infobar } from "./Infobar.tsx";

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
      <Infobar />
      <div id={"modal-root"} />
    </div>
  );
};
