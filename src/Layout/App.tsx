import { Outlet } from "react-router-dom";
import { JamendoPlayerFooter } from "../components/JamendoPlayerFooter.tsx";
import { SideBar } from "./Sidebar.tsx";
import { InfoBar } from "./Infobar.tsx";
import { useDesktopMobileStore } from "../hooks/stores/useDesktopMobileStore.ts";
import { MobileMenu } from "./MobileMenu.tsx";
import { BackButton } from "../components/BackButton.tsx";

export const App = () => {
  // mobile/desktop
  const isMobile = useDesktopMobileStore((s) => s.isMobile);

  return (
    <div
      className={`w-screen bg-[#371A4D] h-screen text-black
      overflow-y-scroll
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
        <div className={"h-screen relative w-full"}>
          <div className={"absolute top-5 left-5"}>
            <BackButton />
          </div>
          <Outlet />
        </div>

        <div className={"fixed bottom-0 left-0 right-0"}>
          <JamendoPlayerFooter />
          {isMobile && <MobileMenu />}
        </div>
      </main>
      {/* Right Sidebar */}
      {!isMobile && <InfoBar />}
      {/*<div id={"modal-root"} /> */}
    </div>
  );
};
