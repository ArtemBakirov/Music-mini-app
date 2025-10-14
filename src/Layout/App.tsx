import { Outlet } from "react-router-dom";
import { JamendoPlayerFooter } from "../components/JamendoPlayerFooter.tsx";
import { SideBar } from "./Sidebar.tsx";
import { InfoBar } from "./Infobar.tsx";
import { useDesktopMobileStore } from "../hooks/stores/useDesktopMobileStore.ts";
import { MobileMenu } from "./MobileMenu.tsx";

export const App = () => {
  // mobile/desktop
  const isMobile = useDesktopMobileStore((s) => s.isMobile);

  return (
    <div
      className={`w-screen bg-[#371A4D] h-screen text-black border-green-500 border-2
          ${!isMobile && "flex"}
        `}
    >
      {/* Left Sidebar */}
      {!isMobile && <SideBar />}
      <main
        className={
          "flex flex-col flex-1 relative my-0 mx-auto font-bold items-center justify-center"
        }
      >
        <Outlet />
        <div className={"fixed bottom-0 left-0 right-0"}>
          <JamendoPlayerFooter />
          {isMobile && <MobileMenu />}
        </div>
      </main>
      {/* Right Sidebar */}
      {!isMobile && <InfoBar />}
      <div id={"modal-root"} />
    </div>
  );
};
