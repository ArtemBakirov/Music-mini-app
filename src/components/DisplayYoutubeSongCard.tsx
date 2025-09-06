import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import YouTube, { YouTubeProps } from "react-youtube";

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
};

export const DisplayYoutubeSongCard = forwardRef<YtTrackHandle, Props>(
  ({ videoId, title, channelTitle, thumbnail }, ref) => {
    const playerRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // A tiny promise that resolves when the iframe player is ready.
    const readyResolveRef = useRef<(() => void) | null>(null);
    const readyPromiseRef = useRef<Promise<void>>(
      new Promise<void>((resolve) => {
        readyResolveRef.current = resolve;
      }),
    );

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
      e.target.mute(); // ensure safe autoplay during priming
      const iframe = e.target.getIframe();
      iframe?.setAttribute(
        "allow",
        "autoplay; encrypted-media; picture-in-picture; fullscreen",
      );
      readyResolveRef.current?.();
    };

    const onStateChange: YouTubeProps["onStateChange"] = (e) => {
      // Keep a simple "isPlaying" for the custom UI
      const YT = (window as any).YT;
      if (!YT) return;
      if (e.data === YT.PlayerState.PLAYING) setIsPlaying(true);
      if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED)
        setIsPlaying(false);
    };

    /*const play = () => {
      const p = playerRef.current;
      if (!p) return;
      // p.unMute();
      // p.setVolume(80);
      p.playVideo();
    };*/

    const play = async () => {
      const p = playerRef.current;
      console.log("play once");
      p.mute(); // safe
      p.playVideo(); // starts muted, allowed
      await new Promise((r) => setTimeout(r, 1000)); // brief tick so player actually transitions
      p.unMute();
      p.setVolume(70);
    };

    const pause = () => {
      playerRef.current?.pauseVideo();
    };

    // "Prime" one video: wait until ready, then muted play→pause quickly.
    // This respects autoplay policies because it's muted.
    const prime = async () => {
      console.log("prime func");
      const p = playerRef.current;
      if (!p) return;
      /*p.mute();
      p.playVideo();
      await new Promise((r) => setTimeout(r, 200)); // brief tick so player actually transitions
      p.pauseVideo();*/
      console.log("play once");
      p.mute(); // safe
      p.playVideo(); // starts muted, allowed
      await new Promise((r) => setTimeout(r, 2000)); // brief tick so player actually transitions
      p.unMute();
      p.setVolume(70);
      console.log("pause, after play");
      // await new Promise((r) => setTimeout(r, 1000));
      // p.pauseVideo();
      // Leave muted/paused. Real user plays will unmute in `play()`.
    };

    useImperativeHandle(
      ref,
      () => ({
        play,
        pause,
        prime,
      }),
      [],
    );

    return (
      <div
        className={`p-2 px-0 mx-2 flex items-center gap-4 border-t-2 ${
          isPlaying ? "border-[#B065A0] animate-pulse" : "border-gray-500"
        }`}
      >
        {/* Hidden iframe player (audio engine) */}
        <div>
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            onStateChange={onStateChange}
          />
        </div>

        {/* Custom UI (thumbnail + overlay button) */}
        <div className="relative rounded-md group flex-shrink-0">
          <img
            src={thumbnail}
            alt={title}
            className="w-12 h-12 object-cover rounded-md"
          />
          <button
            onClick={() => (isPlaying ? pause() : play())}
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
        </div>

        <div className="flex-grow">
          <div className="font-semibold line-clamp-1">{title}</div>
          <div className="text-sm text-gray-300 line-clamp-1">
            {channelTitle}
          </div>
        </div>
      </div>
    );
  },
);
