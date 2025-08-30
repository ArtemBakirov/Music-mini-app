import {
  JamendoPlaylist,
  useJamendoPlaylist,
} from "../hooks/query/jamendo.queries.ts";
import { Ref } from "react";
import { Link } from "react-router-dom";

export const DisplayPlaylist = ({
  playlist,
  lastRef,
}: {
  playlist: JamendoPlaylist;
  lastRef?: Ref<HTMLDivElement>;
}) => {
  const { data } = useJamendoPlaylist(playlist.id);
  console.log("playlist is", playlist, data);
  if (!data) {
    return null;
  }

  return (
    <Link to={`/playlist/${playlist.id}`}>
      <div key={playlist.id} className="group">
        <div className="aspect-square overflow-hidden rounded-lg bg-[#222]">
          <img
            src={playlist.image}
            alt={playlist.name}
            className="w-full h-full object-cover group-hover:opacity-90 transition"
          />
        </div>
        <div className="mt-2 text-sm font-medium line-clamp-1">
          {playlist.name}
        </div>
        {playlist.user_name && (
          <div className="text-xs text-gray-400 line-clamp-1">
            {playlist.user_name}
          </div>
        )}
      </div>
    </Link>
  );
};
