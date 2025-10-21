import React, { useState } from "react";
import Home from "../assets/icons/home.svg?react";
import Playlists from "../assets/icons/playlists.svg?react";
import Account from "../assets/icons/account.svg?react";
import Albums from "../assets/icons/albums.svg?react";

import { Link } from "react-router-dom";

interface MenuItem {
  key: string;
  label: string;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

export const MobileMenu = () => {
  const [active, setActive] = useState<string>("home");
  const mobileMenu: MenuItem[] = [
    { key: "account", label: "Account", Icon: Account },
    { key: "/", label: "Startseite", Icon: Home },
    { key: "all-playlists", label: "Alle Playlists", Icon: Playlists },
    { key: "library", label: "My Library", Icon: Albums },
  ];

  const renderMenu = (items: MenuItem[]) => (
    <div>
      <ul className={"flex justify-between items-center"}>
        {items.map(({ key, Icon, onClick }) => {
          const isActive = active === key;
          return (
            <li
              key={key}
              className={`${key === "account" ? "text-lg" : ""} px-4 py-2 cursor-pointer rounded-md truncate
                ${isActive ? "text-white" : "text-gray-300"}`}
              onClick={() => {
                console.log("setting active", key);
                setActive(key);
                onClick?.();
              }}
            >
              <Link className={"flex items-center gap-3"} to={key}>
                <Icon
                  className={`${key === "account" ? "w-10 h-10" : "w-8 h-8"}  ${isActive && "text-red-800"}`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div className={`bg-[#2D0F3A] text-white z-50 border-t-2 border-[#B065A0]`}>
      {renderMenu(mobileMenu)}
    </div>
  );
};
