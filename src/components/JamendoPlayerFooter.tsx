import { useEffect, useRef } from "react";
import { JamendoPlayerManager } from "../utils/JamendoPlayerManager.ts";
// import { usePlayerStore } from "../hooks/stores/usePlayerStore";
import { useJamendoPlayerStore } from "../hooks/stores/useJamendoPlayerStore";
import Pause from "../assets/icons/pause.svg?react";
import Play from "../assets/icons/play.svg?react";

export const JamendoPlayerFooter = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentSong, isPlaying, setIsPlaying, clearSong } =
    useJamendoPlayerStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.audio;

    if (isPlaying) {
      audio.play().catch((e) => {
        console.error("Autoplay blocked or failed:", e);
      });
    } else {
      audio.pause();
    }
  }, [currentSong, isPlaying]);

  const handleEnded = () => {
    setIsPlaying(false);
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2D0F3A] text-white p-4 flex justify-between items-center z-50">
      <div>
        <div className="font-bold">{currentSong.name}</div>
        <div className="text-sm">{currentSong.artist_name}</div>
      </div>
      <button
        className="bg-red-600 text-white px-3 py-1 rounded"
        onClick={clearSong}
      >
        Stop
      </button>
      <audio ref={audioRef} onEnded={handleEnded} style={{ display: "none" }} />
    </div>
  );
};
