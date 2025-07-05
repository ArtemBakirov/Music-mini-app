// import {usePlaylists} from "../hooks/query/playlist.queries.ts";
// import { useViewStateStore } from "../hooks/stores/useViewStateStore.ts";

import { usePlayerSelector } from "../hooks/stores/usePlayerStore.ts";
import { memo } from "react";
import { useArtistInfo } from "../hooks/useArtistInfo.ts";

export const Infobar = memo(() => {
  console.log("RENDERED");

  // react - query
  // const { data: playlists } = usePlaylists("test_address");

  const currentSong = usePlayerSelector((state) => state.currentSong);
  const isPlaying = usePlayerSelector((state) => state.isPlaying);
  const videoTitle = currentSong?.title ?? null;

  const { data, isLoading, error } = useArtistInfo(videoTitle);
  console.log("data artist", data);

  return (
    <aside className="w-100 border-r-2 border-black p-4 flex flex-col bg-[#502B6C] text-gray-300">
      {currentSong && isPlaying && (
        <div className="flex flex-col items-center gap-4 p-4">
          <h2> Now is playing: </h2>
          <img
            src={`https://i.ytimg.com/vi/${currentSong.videoId}/mqdefault.jpg`}
            alt={currentSong.title}
            className="w-44 h-44 object-cover rounded"
          />
          <h3>{currentSong.title}</h3>
        </div>
      )}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {currentSong && isPlaying && data && (
        <div className="flex flex-col items-center gap-4 p-4">
          <p
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: data.bio?.summary || "" }}
          />
        </div>
      )}
    </aside>
  );
});
