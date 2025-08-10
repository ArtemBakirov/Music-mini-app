import { useEffect, useRef } from "react";
import { useJamendoPlayerStore } from "../hooks/stores/useJamendoPlayerStore";
import { ProgressBar } from "./ProgressBar.tsx";
import { JamendoPlayerManager } from "../utils/JamendoPlayerManager.ts";
import Play from "../assets/icons/play.svg?react";
import Pause from "../assets/icons/pause.svg?react";

export const JamendoPlayerFooter = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = useJamendoPlayerStore((s) => s.currentSong);
  const isPlaying = useJamendoPlayerStore((s) => s.isPlaying);
  const setIsPlaying = useJamendoPlayerStore((s) => s.setIsPlaying);
  const clearSong = useJamendoPlayerStore((s) => s.clearSong);
  const duration = useJamendoPlayerStore((s) => s.duration);
  const currentTime = useJamendoPlayerStore((s) => s.currentTime);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // mount the ONE audio element
  useEffect(() => {
    if (audioRef.current) {
      JamendoPlayerManager.init(audioRef.current);
    }
  }, []);

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleClick = async () => {
    if (isPlaying) {
      JamendoPlayerManager.pause();
      setIsPlaying(false);
    } else {
      JamendoPlayerManager.resume();
      setIsPlaying(true);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-[#2D0F3A] text-white p-4 flex justify-between
    items-center z-50`}
    >
      <div className="flex items-center gap-4 w-full">
        <div>
          <div className="font-bold">{currentSong?.name}</div>
          <div className="text-sm">{currentSong?.artist_name}</div>
        </div>
        <div>
          <button
            onClick={handleClick}
            className="bg-purple-600 text-white px-3 py-1 rounded"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <div className="text-xs text-gray-300 mt-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        <ProgressBar />
      </div>
      <audio ref={audioRef} onEnded={handleEnded} style={{ display: "none" }} />
    </div>
  );
};
