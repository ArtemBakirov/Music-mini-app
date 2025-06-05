import { useEffect, useRef } from "react";
import { Playlist } from "../types/playList.types";

type Props = {
  playlists: Playlist[];
  songId: string;
  onSelect: (playlistId: string) => void;
  onClose: () => void;
};

export const AddSongToolBar = ({
  playlists,
  songId,
  onSelect,
  onClose,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute text-black bg-white shadow-lg border rounded-lg p-4 z-50 w-64"
    >
      <p className="font-semibold mb-2">Add to Playlist:</p>
      <ul className="space-y-2">
        {playlists.map((playlist) => (
          <li
            key={playlist._id}
            className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded text-black"
            onClick={() => onSelect(playlist._id)}
          >
            {playlist.title}
          </li>
        ))}
      </ul>
    </div>
  );
};
