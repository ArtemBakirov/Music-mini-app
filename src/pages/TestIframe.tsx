import YouTube, { YouTubeProps } from "react-youtube";
import "./TestIframe.css";
import { useEffect, useRef } from "react";

type Props = {
  videoId?: string | null;
  //onReady?: YouTubeProps["onReady"];
  //onStateChange?: YouTubeProps["onStateChange"];
  //autoplay?: boolean;
  //startSeconds?: number;
};

export default function TestIframe({
  videoId = "FakWEAvZE4g",
  // onReady, onStateChange, autoplay, startSeconds,
}: Props) {
  if (!videoId) return null;
  const playerRef = useRef<any>(null);
  /*const onReady: YouTubeProps["onReady"] = (e) => {
    playerRef.current = e.target; // YT.Player instance
    const iframe = e.target.getIframe();
    iframe.setAttribute(
      "allow",
      "autoplay; encrypted-media; picture-in-picture; fullscreen",
    );
    // Optional: e.target.mute(); e.target.playVideo();
  };*/

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

  /*const play = () => {
    console.log("play");
    playerRef.current?.mute(); // safe
    playerRef.current?.playVideo(); // must be in the user gesture
    console.log("unmute");
    playerRef.current?.unMute();
    setTimeout(() => {
      console.log("play again");
      playerRef.current?.playVideo();
    }, 1000);
    playerRef.current?.setVolume(70);
  };*/

  /*const pla = () => {
    console.log("pointer down, mute");
    playerRef.current?.mute();
    console.log("play");
    playerRef.current?.playVideo();
    console.log("unmute");
    playerRef.current?.unMute();
    setTimeout(() => {
      console.log("play again");
      playerRef.current?.playVideo();
    }, 1000);
    playerRef.current?.setVolume(70);
  };*/

  /*const y = () => {
    console.log("pointer up");
    playerRef.current?.playVideo();
  };*/

  const pause = () => playerRef.current?.pauseVideo();

  /*useEffect(() => {
    // Example: auto-play muted after mount (safer for autoplay policies)
    const id = setTimeout(() => {
      playerRef.current?.mute();
      playerRef.current?.playVideo();
    }, 500);
    return () => clearTimeout(id);
  }, []);*/

  const onReady: YouTubeProps["onReady"] = (e) => {
    playerRef.current = e.target;
    e.target.mute(); // ensure muted state before any play
    const iframe = e.target.getIframe();
    iframe.setAttribute(
      "allow",
      "autoplay; encrypted-media; picture-in-picture; fullscreen",
    );
  };

  const onPointerDown = () => {
    const p = playerRef.current;
    if (!p) return;
    p.mute(); // safe
    p.playVideo(); // starts muted, allowed
  };

  const onPointerUp = () => {
    const p = playerRef.current;
    if (!p) return;
    // same human gesture (press->release) still counts as a user action
    p.unMute();
    p.setVolume(70);
    p.playVideo();
  };

  // Optional: if something still races, finish the job when YT says "PLAYING".
  const onStateChange: YouTubeProps["onStateChange"] = (e) => {
    // We got to PLAYING but didn't manage to unmute in time; try once more.
    const p = playerRef.current;
    // if (!p) return;
    p.unMute();
    p.setVolume(70);
    p.playVideo();
    // doneRef.current = true;
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div className={"player"}>
        <YouTube
          className={"border-1 border-white styled-player"}
          videoId={videoId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
      <button onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        Play
      </button>
      <button onClick={pause}>Pause</button>
    </div>
  );
}
