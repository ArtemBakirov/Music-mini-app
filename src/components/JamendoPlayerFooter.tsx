import { useEffect, useRef } from "react";
import { useMusicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
import { ProgressBar } from "./ProgressBar.tsx";
import { MusicPlayerManager } from "../utils/MusicPlayerManager.ts";
import { FooterController } from "./FooterController.tsx";

// for yt
import YouTube, { YouTubeProps } from "react-youtube";

export const JamendoPlayerFooter = () => {
  const audioRef = useRef<HTMLAudioElement | any>(null);
  // console.log("audioref", audioRef);

  const currentSong = useMusicPlayerStore((s) => s.currentSong);

  // console.log("current song", currentSong);

  // console.log("currentSong footer", currentSong);

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
  const provider = useMusicPlayerStore((s) => s.provider);
  // console.log("provider footer", provider);
  // console.log("provider", provider);
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // mount the ONE audio element
  useEffect(() => {
    // console.log("useEffect footer", audioRef.current, provider);
    if (audioRef.current) {
      if (provider === "jamendo") {
        MusicPlayerManager.init(audioRef.current);
      }
      //
    }
  }, [currentSong]);

  const handleEnded = () => {
    console.log("set after ended");
    setIsPlaying(false);
  };

  const handleClick = async () => {
    console.log("click footer");
    if (isPlaying) {
      MusicPlayerManager.pause();
      setIsPlaying(false);
    } else {
      MusicPlayerManager.resume();
      console.log("Change state in Footer");
      setIsPlaying(true);
    }
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

  const onYTReady: YouTubeProps["onReady"] = (e) => {
    console.log("onYTReady", e);
    MusicPlayerManager.init(e.target); // YT.Player
  };

  const onYTStateChange: YouTubeProps["onStateChange"] = (e) => {
    MusicPlayerManager.onYTStateChange?.(e);
  };

  // if (!currentSong) return null;
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-[#2D0F3A] text-white p-4 flex justify-between
    items-center z-50 px-32`}
    >
      <div className="flex items-center gap-4 w-full">
        <div>
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
            <div className="font-bold">
              {currentSong?.title || currentSong?.name}
            </div>
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
          {provider === "jamendo" && (
            <div>
              <audio
                ref={audioRef}
                onEnded={handleEnded}
                // style={{ display: "none" }}
              />
            </div>
          )}
          {provider === "youtube" && (
            <>
              <div>Rendered YouTube</div>
              <YouTube
                // ref={audioRef}
                // videoId={videoId}
                opts={opts}
                onReady={onYTReady}
                onStateChange={onYTStateChange}
                // onReady={onReady}
                // onStateChange={onStateChange}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
