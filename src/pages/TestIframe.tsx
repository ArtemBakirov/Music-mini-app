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

export default function TestIframe({ videoId = "FakWEAvZE4g" }: Props) {
  const playerRef = useRef<YT.Player | null>(null);
  const armedRef = useRef(false); // we started muted play on press
  const doneRef = useRef(false); // we've completed the one-click flow

  const onReady: YouTubeProps["onReady"] = (e) => {
    playerRef.current = e.target;
    e.target.mute();
    e.target
      .getIframe()
      .setAttribute(
        "allow",
        "autoplay; encrypted-media; picture-in-picture; fullscreen",
      );
  };

  const onPointerDown: React.PointerEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault(); // avoid extra "click" surprises
    const p = playerRef.current;
    if (!p) return;
    doneRef.current = false;
    armedRef.current = true;
    p.mute();
    p.playVideo(); // muted start (allowed)
  };

  const onPointerUp: React.PointerEventHandler<HTMLButtonElement> = (ev) => {
    ev.preventDefault();
    const p = playerRef.current;
    if (!p || !armedRef.current || doneRef.current) return;

    // If the gesture is still active, do everything audible right now:
    // (check is optional, but useful for debugging)
    // console.log('userActivation.isActive', (navigator as any).userActivation?.isActive);

    p.unMute();
    p.setVolume(70);
    p.playVideo(); // ensure *audible* play is tied to THIS gesture
    doneRef.current = true;
  };

  // Optional: if something still races, finish the job when YT says "PLAYING".
  const onStateChange: YouTubeProps["onStateChange"] = (e) => {
    if (
      e.data === YT.PlayerState.PLAYING &&
      armedRef.current &&
      !doneRef.current
    ) {
      // We got to PLAYING but didn't manage to unmute in time; try once more.
      const p = playerRef.current;
      if (!p) return;
      p.unMute();
      p.setVolume(70);
      doneRef.current = true;
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <YouTube
        videoId={videoId as string}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
      />
      <button
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={(e) => e.preventDefault()}
      >
        Play
      </button>
    </div>
  );
}
