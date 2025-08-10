import { Outlet } from "react-router-dom";
// import { Navbar } from "./Navbar";
import { JamendoPlayerFooter } from "../components/JamendoPlayerFooter.tsx";
import { Sidebar } from "./Sidebar.tsx";
import { InfoBar } from "./Infobar.tsx";

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
        <JamendoPlayerFooter />
      </main>
      {/* Right Sidebar */}
      <InfoBar />
      <div id={"modal-root"} />
    </div>
  );
};
