import { Outlet } from "react-router-dom";
import { PlayerFooterComponent } from "../components/PlayerFooterComponent.tsx";
import { SideBar } from "./Sidebar.tsx";
import { InfoBar } from "./Infobar.tsx";
import { useDesktopMobileStore } from "../hooks/stores/useDesktopMobileStore.ts";
import { MobileMenu } from "./MobileMenu.tsx";
import { BackButton } from "../components/BackButton.tsx";
import { SdkService } from "../bastyon-sdk/sdkService.ts";

// if inside bastyon, there must be a padding on the top, because of the iframe's navigation buttons

export const App = () => {
  // mobile/desktop
  const isMobile = useDesktopMobileStore((s) => s.isMobile);
  const inBastyon = SdkService.inBastyon();
  console.log("in bastyon", inBastyon);

  return (
    <div
      className={`w-screen bg-[#371A4D] h-screen text-black
      overflow-hidden
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
        <div
          className={`h-screen relative w-full
          ${inBastyon ? "pt-14" : isMobile ? "pt-5" : ""}`}
        >
          <div
            className={`absolute left-5 z-50 ${inBastyon ? "top-14" : "top-5"}`}
          >
            <BackButton />
          </div>
          <Outlet />
        </div>

        <div className={"fixed bottom-0 left-0 right-0"}>
          <PlayerFooterComponent />
          {isMobile && <MobileMenu />}
        </div>
      </main>
      {/* Right Sidebar */}
      {!isMobile && <InfoBar />}
      {/*<div id={"modal-root"} /> */}
    </div>
  );
};
