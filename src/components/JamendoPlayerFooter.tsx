import { useEffect, useRef } from "react";
import { useJamendoPlayerStore } from "../hooks/stores/useJamendoPlayerStore";
import { ProgressBar } from "./ProgressBar.tsx";
import { JamendoPlayerManager } from "../utils/JamendoPlayerManager.ts";
import { FooterController } from "./FooterController.tsx";

export const JamendoPlayerFooter = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = useJamendoPlayerStore((s) => s.currentSong);
  const isPlaying = useJamendoPlayerStore((s) => s.isPlaying);
  const setIsPlaying = useJamendoPlayerStore((s) => s.setIsPlaying);
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
    items-center z-50 px-32`}
    >
      <div className="flex items-center gap-4 w-full">
        <div>
          {/*<button
            onClick={handleClick}
            className="bg-purple-600 text-white px-3 py-1 rounded"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button> */}
          <FooterController
            onPlayPauseClick={handleClick}
            isPlaying={isPlaying}
          />
        </div>
        <div className={"flex flex-col items-center w-full"}>
          <div className={"flex gap-4 justify-center mb-2"}>
            <div className="font-bold">{currentSong?.name}</div>
            <div className="font-bold">{currentSong?.artist_name}</div>
          </div>
          <ProgressBar />
        </div>
        <div className="text-xs text-gray-300 mt-1">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      <audio ref={audioRef} onEnded={handleEnded} style={{ display: "none" }} />
    </div>
  );
};
