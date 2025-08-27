import YouTube, { YouTubeProps } from "react-youtube";
import "./TestIframe.css";
import { useEffect, useRef } from "react";

type Props = {
  videoId: string | null;
  //onReady?: YouTubeProps["onReady"];
  //onStateChange?: YouTubeProps["onStateChange"];
  //autoplay?: boolean;
  //startSeconds?: number;
};

export default function TestIframe({
  videoId,
  // onReady, onStateChange, autoplay, startSeconds,
}: Props) {
  if (!videoId) return null;
  const playerRef = useRef<any>(null);
  const onReady: YouTubeProps["onReady"] = (e) => {
    playerRef.current = e.target; // YT.Player instance
    // Optional: e.target.mute(); e.target.playVideo();
  };

  const opts: YouTubeProps["opts"] = {
    width: "100%",
    height: "100%",
    playerVars: {
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      // autoplay: autoplay ? 1 : 0,
      // start: startSeconds ?? 0,
      origin: window.location.origin,
    },
  };

  const play = () => {
    console.log("play");
    playerRef.current?.playVideo();
    console.log("play again");
    playerRef.current?.playVideo();
    playerRef.current?.playVideo();
    playerRef.current?.playVideo();
    console.log("tried to play");
  };
  const pause = () => playerRef.current?.pauseVideo();

  useEffect(() => {
    // Example: auto-play muted after mount (safer for autoplay policies)
    const id = setTimeout(() => {
      playerRef.current?.mute();
      playerRef.current?.playVideo();
    }, 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div className={"player"}>
        <YouTube
          className={"border-1 border-white styled-player"}
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          // onStateChange={onStateChange}
        />
      </div>
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
    </div>
  );
}
