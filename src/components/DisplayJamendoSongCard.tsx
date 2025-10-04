import { useMusicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
import { MusicPlayerManager } from "../utils/MusicPlayerManager.ts";
import Play from "../assets/icons/play.svg?react";
import Pause from "../assets/icons/pause.svg?react";
// import { ProgressBar } from "./ProgressBar.tsx";

export const DisplayJamendoSongCard = ({
  songData,
  idx,
  allTracks,
}: {
  songData: any;
  idx: number;
  allTracks: Array<any>;
}) => {
  const currentSong = useMusicPlayerStore((s) => s.currentSong);
  const isPlaying = useMusicPlayerStore((s) => s.isPlaying);
  const setCurrentSong = useMusicPlayerStore((s) => s.setCurrentSong);
  const setIsPlaying = useMusicPlayerStore((s) => s.setIsPlaying);
  const setQueue = useMusicPlayerStore((s) => s.setQueue);
  const playAt = useMusicPlayerStore((s) => s.playAt);
  const setProvider = useMusicPlayerStore((s) => s.setProvider);
  const isCurrent = currentSong?.id === songData.id;
  console.log("currentSong", currentSong);
  const isPlayingCurrent = isCurrent && isPlaying;
  console.log("isCurrentPlaying", isPlayingCurrent);
  const handleClick = async () => {
    console.log("click jamendo");
    if (!isCurrent) {
      setQueue(allTracks);
      MusicPlayerManager.pause(); // pause whatever was playing
      console.log("setting songData", songData);
      setCurrentSong(songData); // switch song in store
      setProvider("jamendo");
      setIsPlaying(true); // footer effect will call syncToState()
      playAt(idx);
    } else {
      if (isPlaying) {
        MusicPlayerManager.pause();
        setIsPlaying(false);
      } else {
        MusicPlayerManager.resume();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div
      key={idx}
      className={`p-2 px-0 mx-2 flex items-center gap-4
        ${isCurrent ? "border-t-2 border-[#B065A0]" : "border-t-2 border-gray-500"}
        ${isPlayingCurrent ? "animate-pulse" : ""}
        `}
    >
      <div className={"relative rounded-md group flex-shrink-0"}>
        <img
          src={songData.album_image}
          alt={songData.name}
          className="w-12 h-12 object-cover rounded-md"
        />
        <button
          onClick={handleClick}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2
          -translate-y-1/2 text-white flex items-center justify-center
          opacity-0 group-hover:opacity-100 transition-opacity
          `}
        >
          {isPlayingCurrent ? (
            <Pause className={"w-10 h-10"} />
          ) : (
            <Play className={"w-10 h-10"} />
          )}
        </button>
      </div>

      <div className="flex-grow">
        <div className="font-semibold">{songData.name}</div>
        <div className="text-sm text-gray-300">{songData.artist_name}</div>
      </div>

      {/* Show progress bar only for the current playing song */}
      {/* isCurrent && <ProgressBar /> */}
    </div>
  );
};
