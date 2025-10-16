import { useJamendoPlayerSelector } from "../hooks/stores/useMusicPlayerStore.ts";
import { memo } from "react";
import { useArtistInfo } from "../hooks/useArtistInfo.ts";
import FullScreen from "../assets/icons/full_screen.svg?react";

export const InfoBar = memo(() => {
  const currentSong = useJamendoPlayerSelector((state) => state.currentSong);
  const artist_id = useJamendoPlayerSelector(
    (state) => state.currentSong?.artist_id,
  );
  const isPlaying = useJamendoPlayerSelector((state) => state.isPlaying);
  const videoTitle = currentSong?.title ?? null;

  const { data, isLoading, error } = useArtistInfo(artist_id);
  const info = data?.results[0];

  return (
    <aside className="w-100 p-4 flex flex-col bg-[#502B6C] text-gray-300">
      {currentSong && (
        <>
          <FullScreen className="w-8 h-8 text-white hover:text-gray-300 cursor-pointer" />
          <div className="flex flex-col items-center gap-4 p-4">
            <h2> Now is playing: </h2>
            <img
              src={`https://usercontent.jamendo.com/?cid=1652438404&type=artist&id=${artist_id}&width=300`}
              alt=""
            />
            <h3>{currentSong.name}</h3>
          </div>
        </>
      )}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {currentSong && info && (
        <div className="flex flex-col items-center gap-4 p-4">
          <a target="_blank" href={`${info.shareurl}`}>
            Artist on Jamendo
          </a>
        </div>
      )}
    </aside>
  );
});
