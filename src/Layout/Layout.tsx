import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <div className={"bg-[#F1F6F9] h-screen"}>
      <div className={"relative my-0 mx-auto max-w-5xl font-bold flex flex-col items-center justify-center"}>
        {/*<Navbar />*/}
        <Outlet />
      </div>
    </div>
  );
};
