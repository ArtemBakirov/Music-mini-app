import { useEffect, useRef } from "react";
import { useJamendoPlayerStore } from "../hooks/stores/useJamendoPlayerStore";
import { ProgressBar } from "./ProgressBar.tsx";
import { JamendoPlayerManager } from "../utils/JamendoPlayerManager.ts";

export const JamendoPlayerFooter = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  /*const { currentSong, isPlaying, setIsPlaying, clearSong } =
    useJamendoPlayerStore((s) => ({
      currentSong: s.currentSong,
      isPlaying: s.isPlaying,
      setIsPlaying: s.setIsPlaying,
      clearSong: s.clearSong,
    }));*/

  const currentSong = useJamendoPlayerStore((s) => s.currentSong);
  const isPlaying = useJamendoPlayerStore((s) => s.isPlaying);
  const setIsPlaying = useJamendoPlayerStore((s) => s.setIsPlaying);
  const clearSong = useJamendoPlayerStore((s) => s.clearSong);

  // mount the ONE audio element
  useEffect(() => {
    if (audioRef.current) {
      JamendoPlayerManager.init(audioRef.current);
    }
  }, []);

  /*useEffect(() => {
    console.log("sync to state");
    void JamendoPlayerManager.syncToState();
  }, [currentSong, isPlaying]);*/

  // if (!currentSong) return null;

  /* useEffect(() => {
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
    void JamendoPlayerManager.syncToState();

    const updateProgress = () => {
      if (!audio.duration) return;
      const percent = (audio.currentTime / audio.duration) * 100;
      setCurrentTime(audio.currentTime);
      setProgress(percent);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [currentSong, isPlaying]);*/

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-[#2D0F3A] text-white p-4 flex justify-between
    items-center z-50 ${isPlaying ? "" : "hidden"}`}
    >
      <div>
        <div className="font-bold">{currentSong?.name}</div>
        <div className="text-sm">{currentSong?.artist_name}</div>
      </div>
      <button
        className="bg-red-600 text-white px-3 py-1 rounded"
        onClick={() => clearSong()}
      >
        Stop
      </button>
      <ProgressBar />
      <audio ref={audioRef} onEnded={handleEnded} style={{ display: "none" }} />
    </div>
  );
};
