import Heart from "../assets/icons/heart.svg?react";
import Note from "../assets/icons/note.svg?react";
import { NavLink } from "react-router-dom";

export const Navbar = () => {
  return(
    <nav className={" absolute z-50 top-20 right-30 flex gap-10"}>
        <div className={"rounded-full bg-white p-2 hover:bg-gray-200 transition-colors duration-200 ease-in-out cursor-pointer"}>
          <NavLink to={"/"}>
            <Heart height={'35px'} color={"#000"} />
          </NavLink>
        </div>
        <div className={"rounded-full bg-white p-2 hover:bg-gray-200 transition-colors duration-200 ease-in-out cursor-pointer"}>
          <NavLink to={"/music"}>
            <Note height={'35px'} color={"#000"} />
          </NavLink>
        </div>
    </nav>
  )
}
