import { Outlet } from "react-router-dom";
import { JamendoPlayerFooter } from "../components/JamendoPlayerFooter.tsx";
import { SideBar } from "./Sidebar.tsx";
import { InfoBar } from "./Infobar.tsx";

export const App = () => {
  return (
    <div className={"flex bg-[#371A4D] h-screen text-black"}>
      {/* Left Sidebar */}
      <SideBar />
      <main
        className={
          "flex flex-col flex-1 relative my-0 mx-auto font-bold items-center justify-center"
        }
      >
        <Outlet />
        <JamendoPlayerFooter />
      </main>
      {/* Right Sidebar */}
      <InfoBar />
      <div id={"modal-root"} />
    </div>
  );
};
