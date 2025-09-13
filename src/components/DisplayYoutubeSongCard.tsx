import { useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";
import { useMusicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
import { MusicPlayerManager } from "../utils/MusicPlayerManager.ts";

export type YtTrackHandle = {
  play: () => void;
  pause: () => void;
  prime: () => Promise<void>; // mute -> play -> brief wait -> pause (used before UI)
};

type Props = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  allTracks: Array<any>;
  idx: number;
  track: any;
};

export const DisplayYoutubeSongCard = ({
  videoId,
  title,
  channelTitle,
  thumbnail,
  allTracks,
  idx,
  track,
}: Props) => {
  const playerRef = useRef<any>(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(true);

  // player state
  // console.log("track", track);

  const currentSong = useMusicPlayerStore((s) => s.currentSong);
  const isPlaying = useMusicPlayerStore((s) => s.isPlaying);
  const setCurrentSong = useMusicPlayerStore((s) => s.setCurrentSong);
  const setIsPlaying = useMusicPlayerStore((s) => s.setIsPlaying);
  const setQueue = useMusicPlayerStore((s) => s.setQueue);
  const playAt = useMusicPlayerStore((s) => s.playAt);
  const setProvider = useMusicPlayerStore((s) => s.setProvider);
  const isCurrent = currentSong?.id === videoId;
  const isPlayingCurrent = isCurrent && isPlaying;

  const handleClick = async () => {
    if (!isCurrent) {
      // console.log("not current");
      setQueue(allTracks);
      MusicPlayerManager.pause(); // pause whatever was playing
      // console.log("setting provider");
      // setProvider("youtube");
      setCurrentSong({
        name: title,
        album_image: thumbnail,
        audio: videoId,
      }); // switch song in store

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

  // A tiny promise that resolves when the iframe player is ready.
  const readyResolveRef = useRef<(() => void) | null>(null);

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

  const onReady: YouTubeProps["onReady"] = (e) => {
    playerRef.current = e.target; // window.YT.Player
    console.log("onReady", e.target);
    e.target.mute(); // ensure safe autoplay during priming
    const iframe = e.target.getIframe();
    iframe?.setAttribute(
      "allow",
      "autoplay; encrypted-media; picture-in-picture; fullscreen",
    );
    readyResolveRef.current?.();
    setTimeout(() => {
      setIsReady(true);
    }, 2000);
  };

  const onStateChange: YouTubeProps["onStateChange"] = (e) => {
    // Keep a simple "isPlaying" for the custom UI
    const YT = (window as any).YT;
    if (!YT) return;
    if (e.data === YT.PlayerState.PLAYING) setIsPlaying(true);
    if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED)
      setIsPlaying(false);
  };

  const play = async () => {
    const p = playerRef.current;
    console.log("play once");
    p.mute(); // safe
    p.playVideo(); // starts muted, allowed
    await new Promise((r) => setTimeout(r, 500)); // brief tick so player actually transitions
    p.unMute();
    p.setVolume(70);
  };

  const pause = () => {
    playerRef.current?.pauseVideo();
  };

  return (
    <div
      className={`p-2 px-0 mx-2 flex items-center gap-4 border-t-2 ${
        isPlaying ? "border-[#B065A0] animate-pulse" : "border-gray-500"
      }`}
    >
      {/* Hidden iframe player (audio engine) */}
      {/*<div>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>*/}

      {/* Custom UI (thumbnail + overlay button) */}
      <div className="relative rounded-md group flex-shrink-0">
        <img
          src={thumbnail}
          alt={title}
          className="w-12 h-12 object-cover rounded-md"
        />
        {isReady ? (
          <button
            onClick={handleClick}
            className="absolute top-1/2 left-1/2 -translate-x-1/2
                       -translate-y-1/2 text-white opacity-0 group-hover:opacity-100
                       transition-opacity"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        ) : (
          <div
            className="animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2
                       -translate-y-1/2 text-white
                       transition-opacity"
          >
            Loading...
          </div>
        )}
      </div>

      <div className="flex-grow">
        <div className="font-semibold line-clamp-1">{title}</div>
        <div className="text-sm text-gray-300 line-clamp-1">{channelTitle}</div>
      </div>
    </div>
  );
};
