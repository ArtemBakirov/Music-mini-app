import { useEffect, useRef } from "react";
import { PlaylistSongsIds, Playlist } from "../types/playList.types";
import Check from "../assets/icons/check.svg?react";

type Props = {
  playlists: Playlist[];
  songId: string;
  onSelect: (playlistId: string) => void;
  onClose: () => void;
  allSongsIds?: PlaylistSongsIds[];
};

export const AddSongToolBar = ({
  playlists,
  allSongsIds,
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
        {playlists.map((playlist) => {
          const songsIds =
            allSongsIds?.find((p) => p._id === playlist._id)?.videoIds || [];
          const included = songsIds.includes(songId);
          return (
            <li
              key={playlist._id}
              className="cursor-pointer hover:bg-gray-100 px-3 py-1 rounded text-black"
              onClick={() => {
                if (included) {
                  alert("Song already in this playlist");
                } else {
                  onSelect(playlist._id);
                }
              }}
            >
              {playlist.title}
              {included && <Check className={"text-black"} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
