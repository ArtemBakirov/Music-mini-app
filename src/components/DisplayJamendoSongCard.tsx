import { useJamendoPlayerStore } from "../hooks/stores/useJamendoPlayerStore.ts";
import { JamendoPlayerManager } from "../utils/JamendoPlayerManager.ts";
import Play from "../assets/icons/play.svg?react";
import Pause from "../assets/icons/pause.svg?react";
import { ProgressBar } from "./ProgressBar.tsx";

export const DisplayJamendoSongCard = ({
  songData,
  idx,
}: {
  songData: any;
  idx: number;
}) => {
  /*const { currentSong, isPlaying, setCurrentSong, setIsPlaying } =
    useJamendoPlayerStore((s) => ({
      currentSong: s.currentSong,
      isPlaying: s.isPlaying,
      setCurrentSong: s.setCurrentSong,
      setIsPlaying: s.setIsPlaying,
    }));*/

  const currentSong = useJamendoPlayerStore((s) => s.currentSong);
  const isPlaying = useJamendoPlayerStore((s) => s.isPlaying);
  const setCurrentSong = useJamendoPlayerStore((s) => s.setCurrentSong);
  const setIsPlaying = useJamendoPlayerStore((s) => s.setIsPlaying);

  const isCurrent = currentSong?.id === songData.id;

  const handleClick = async () => {
    if (!isCurrent) {
      JamendoPlayerManager.pause(); // pause whatever was playing
      setCurrentSong(songData); // switch song in store
      setIsPlaying(true); // footer effect will call syncToState()
    } else {
      if (isPlaying) {
        JamendoPlayerManager.pause();
        setIsPlaying(false);
      } else {
        JamendoPlayerManager.resume();
        setIsPlaying(true);
      }
    }
  };

  /*useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isCurrent) return;

    audio.src = songData.audio;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }

    const updateProgress = () => {
      if (!audio.duration) return;
      const percent = (audio.currentTime / audio.duration) * 100;
      setCurrentTime(audio.currentTime);
      setProgress(percent);
    };

    const onMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", onMetadata);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", onMetadata);
    };
  }, [isCurrent, isPlaying, songData.audio]);*/

  return (
    <div key={idx} className={"border p-4 rounded-lg flex items-center gap-4"}>
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
        {isCurrent && isPlaying ? <Pause /> : <Play />}
      </button>

      {/* Show progress bar only for the current playing song */}
      {isCurrent && <ProgressBar />}

      {/* <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        style={{ display: "none" }}
      /> */}
    </div>
  );
};
