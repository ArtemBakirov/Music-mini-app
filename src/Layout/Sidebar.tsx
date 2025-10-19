import { useState } from "react";
import Home from "../assets/icons/home.svg?react";
import NewReleases from "../assets/icons/new.svg?react";
import RecentlyAdded from "../assets/icons/recent.svg?react";
import Artists from "../assets/icons/artist.svg?react";
import Albums from "../assets/icons/albums.svg?react";
import Tracks from "../assets/icons/tracks.svg?react";
import Playlists from "../assets/icons/playlists.svg?react";
import Account from "../assets/icons/account.svg?react";
import Upload from "../assets/icons/upload.svg?react";
import MyUploads from "../assets/icons/my_uploads.svg?react";

// router
import { Link } from "react-router-dom";

interface MenuItem {
  key: string;
  label: string;
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

export const SideBar = () => {
  const [active, setActive] = useState<string>("home");

  const mainMenu: MenuItem[] = [
    { key: "account", label: "Account", Icon: Account },
    { key: "/", label: "Startseite", Icon: Home },
    { key: "new", label: "Neu", Icon: NewReleases },
  ];

  const libraryMenu: MenuItem[] = [
    { key: "recent", label: "Zuletzt hinzugefügt", Icon: RecentlyAdded },
    { key: "artists", label: "Künstler", Icon: Artists },
    { key: "albums", label: "Alben", Icon: Albums },
    { key: "library", label: "Titel", Icon: Tracks },
  ];

  const playlistsMenu: MenuItem[] = [
    { key: "all-playlists", label: "Alle Playlists", Icon: Playlists },
  ];

  const uploadsMenu: MenuItem[] = [
    { key: "create", label: "Create Upload", Icon: Upload },
    // { key: "myUploads", label: "My Uploads", Icon: MyUploads },
  ];

  const renderMenu = (title: string, items: MenuItem[]) => (
    <div className="mb-6">
      {title && <div className="px-4 text-xs text-gray-400 mb-2">{title}</div>}
      <ul>
        {items.map(({ key, label, Icon, onClick }) => {
          const isActive = active === key;
          return (
            <li
              key={key}
              className={`${key === "account" ? "text-lg" : ""} px-4 py-2 cursor-pointer rounded-md truncate
                ${isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`}
              onClick={() => {
                setActive(key);
                onClick?.();
              }}
            >
              <Link className={"flex items-center gap-3"} to={key}>
                <Icon
                  className={`${key === "account" ? "w-6 h-6" : "w-5 h-5"}`}
                />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <aside className=" bg-[#502B6C] w-60 h-screen text-white flex flex-col py-4 pt-16py-4 pt-16">
      {renderMenu("", mainMenu)}
      {renderMenu("Meine Mediathek", libraryMenu)}
      {renderMenu("Playlists", playlistsMenu)}
      {renderMenu("Meine Uploads", uploadsMenu)}
    </aside>
  );
};
