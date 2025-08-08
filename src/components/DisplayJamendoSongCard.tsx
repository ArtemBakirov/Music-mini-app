import { useJamendoPlayerStore } from "../hooks/stores/useJamendoPlayerStore.ts";
import Play from "../assets/icons/play.svg?react";
import Pause from "../assets/icons/pause.svg?react";

export const DisplayJamendoSongCard = ({
  songData,
  idx,
}: {
  songData: any;
  idx: number;
}) => {
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying } =
    useJamendoPlayerStore();

  const isCurrent = currentSong?.id === songData.id;

  const handleClick = () => {
    if (!isCurrent) {
      setCurrentSong(songData); // new song triggers play in PlayerFooter
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      key={idx}
      className={`border p-4 rounded-lg flex items-center gap-4 ${
        isCurrent ? "bg-purple-50" : ""
      }`}
    >
      <img
        src={songData.album_image}
        alt={songData.name}
        className="w-16 h-16 object-cover rounded-md"
      />
      <div className="flex-grow">
        <div className="font-semibold">{songData.name}</div>
        <div className="text-sm text-gray-300">{songData.artist_name}</div>
      </div>
      <button
        onClick={handleClick}
        className="bg-purple-600 text-white px-3 py-1 rounded"
      >
        {isCurrent && isPlaying ? "⏸ Pause" : "▶️ Play"}
      </button>
    </div>
  );
};
