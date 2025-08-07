import { useEffect, useRef, useState } from "react";

export const TestIframe = () => {
  const videoId = "8mGBaXPlri8";
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&rel=0`;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [passedTime, setPassedTime] = useState(0); // in seconds
  const [startTime, setStartTime] = useState(0);
  const playbackTimer = useRef<number | null>(null);
  const playbackStartTimestamp = useRef<number | null>(null); // in ms

  const iframeSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&rel=0&start=${Math.floor(
    startTime,
  )}`;

  useEffect(() => {
    if (isPlaying) {
      playbackStartTimestamp.current = Date.now();

      playbackTimer.current = window.setInterval(() => {
        const now = Date.now();
        const elapsedSeconds =
          (now - (playbackStartTimestamp.current || now)) / 1000;
        setPassedTime((prevTime) => prevTime + elapsedSeconds);
        playbackStartTimestamp.current = now;
      }, 1000);
    }
    return () => {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
        playbackTimer.current = null;
      }
    };
  }, [isPlaying]);

  const play = () => {
    setIsPlaying(true);
  };
  const stop = () => {
    setIsPlaying(false);
    setStartTime(0);
  };

  const pause = () => {
    setIsPlaying(false);
    // setIsPaused(true);
    setStartTime(passedTime);
  };

  return (
    <div>
      <p>This is a component for testing the iframe from youtube</p>

      {isPlaying && (
        <iframe
          width="100%"
          height="100"
          src={iframeSrc}
          allow="autoplay; encrypted-media"
          title="YouTube video player"
          frameBorder="0"
          allowFullScreen
        />
      )}
      <div className="flex gap-4">
        <button onClick={play}>Play Iframe</button>
        <button onClick={stop}>Stop Iframe</button>
        <button onClick={pause}>Pause Iframe</button>
      </div>
      <p className="text-sm text-gray-400 border-1 border- black mt-6">
        Approx. current time: {Math.floor(passedTime)} seconds
      </p>
    </div>
  );
};
