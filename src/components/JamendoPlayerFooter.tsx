import { useEffect, useRef } from "react";
import { useMusicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
import { ProgressBar } from "./ProgressBar.tsx";
import { MusicPlayerManager } from "../utils/MusicPlayerManager.ts";
import { FooterController } from "./FooterController.tsx";

// for yt
import YouTube, { YouTubeProps } from "react-youtube";

export const JamendoPlayerFooter = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  console.log("audioref", audioRef);

  const currentSong = useMusicPlayerStore((s) => s.currentSong);
  const isPlaying = useMusicPlayerStore((s) => s.isPlaying);
  const setIsPlaying = useMusicPlayerStore((s) => s.setIsPlaying);
  const duration = useMusicPlayerStore((s) => s.duration);
  const currentTime = useMusicPlayerStore((s) => s.currentTime);

  // new state/selectors
  const next = useMusicPlayerStore((s) => s.next);
  const prev = useMusicPlayerStore((s) => s.prev);
  const toggleShuffle = useMusicPlayerStore((s) => s.toggleShuffle);
  const cycleRepeat = useMusicPlayerStore((s) => s.cycleRepeat);
  const isShuffling = useMusicPlayerStore((s) => s.isShuffling);
  const repeatMode = useMusicPlayerStore((s) => s.repeatMode);

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // mount the ONE audio element
  useEffect(() => {
    if (audioRef.current) {
      console.log("init audio");
      MusicPlayerManager.init(audioRef.current);
    }
  }, []);

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleClick = async () => {
    if (isPlaying) {
      MusicPlayerManager.pause();
      setIsPlaying(false);
    } else {
      MusicPlayerManager.resume();
      setIsPlaying(true);
    }
  };

  const playYoutube = async () => {
    const p = playerRef.current;
    console.log("play once");
    p.mute(); // safe
    p.playVideo(); // starts muted, allowed
    await new Promise((r) => setTimeout(r, 500)); // brief tick so player actually transitions
    p.unMute();
    p.setVolume(70);
  };

  const opts: YouTubeProps["opts"] = {
    width: "0",
    height: "0",
    playerVars: {
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      // no autoplay here; we control it manually
      origin: window.location.origin,
    },
  };

  // if (!currentSong) return null;
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
            onPrevClick={prev}
            onNextClick={next}
            onShuffleClick={toggleShuffle}
            onRepeatClick={cycleRepeat}
            shuffleActive={isShuffling}
            repeatMode={repeatMode}
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

      {currentSong && (
        <>
          {currentSong?.provider === "jamendo" && (
            <audio
              ref={audioRef}
              onEnded={handleEnded}
              style={{ display: "none" }}
            />
          )}
          {currentSong?.provider === "youtube" && (
            <YouTube
              ref={audioRef}
              // videoId={videoId}
              opts={opts}
              // onReady={onReady}
              // onStateChange={onStateChange}
            />
          )}
        </>
      )}
    </div>
  );
};
