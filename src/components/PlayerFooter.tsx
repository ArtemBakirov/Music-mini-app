import { useEffect, useRef, useState } from "react";
import Play from "../assets/icons/play.svg?react";
import Pause from "../assets/icons/pause.svg?react";
import { usePlayerStore } from "../hooks/stores/usePlayerStore";
import { youtubePlayerManager } from "../utils/YoutubePlayerManager";

export const PlayerFooter = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const intervalRef = useRef<number | null>(null);


  // const [isPlaying, setIsPlaying] = useState(false);
  // const [progress, setProgress] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  const {
    currentSong,
    isPlaying,
    progress,
    // setCurrentSong,
    setIsPlaying,
    setProgress,
    // setPlayer,
    // player,
    clearSong,
  } = usePlayerStore();
  // player reference
  const playerRef = useRef<any>(null);

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      if (isSeeking) setIsSeeking(false);

      intervalRef.current = window.setInterval(() => {
        const current = playerRef.current?.getCurrentTime?.() || 0;
        const total = playerRef.current?.getDuration?.() || 1;
        setProgress((current / total) * 100);
      }, 500);
    } else {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (!currentSong || !containerRef.current || !window.YT?.Player) return;

    /*playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: currentSong.videoId,
      events: {
        onReady: () => setIsPlayerReady(true),
        onStateChange: onPlayerStateChange,
      },
    });*/
    youtubePlayerManager.initPlayer(containerRef.current, currentSong.videoId, (event) => {
      if (event.data === YT.PlayerState.PLAYING) {
        setIsPlaying(true);
        const interval = setInterval(() => {
          setProgress(youtubePlayerManager.getProgress());
        }, 500);
        return () => clearInterval(interval);
      } else {
        setIsPlaying(false);
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      youtubePlayerManager.destroy?.();
    };
  }, [currentSong]);

  const play = () => {
    if (youtubePlayerManager.play) {
      console.log("play")
      // setCurrentSong(songData)
      youtubePlayerManager.play();
    }
  };

  const pause = () => {
    console.log("Pause")
    console.log("player ref", playerRef.current);
    youtubePlayerManager.pause();
  };

  const seekTo = (percentage: number) => {
    setIsSeeking(true);
    // const duration = playerRef.current?.getDuration?.() || 1;
    youtubePlayerManager.seekTo?.(percentage);
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#2D0F3A] text-white px-4 py-2 flex items-center justify-between shadow-xl z-50">
      <div className="flex items-center gap-4">
        <img
          src={`https://i.ytimg.com/vi/${currentSong.videoId}/mqdefault.jpg`}
          alt={currentSong.title}
          className="w-12 h-12 object-cover rounded"
        />
        <div>
          <div className="font-bold text-sm">{currentSong.title}</div>
        </div>
      </div>

      <div className="flex flex-col w-full mx-6">
        <div
          className="h-2 bg-[#444] rounded cursor-pointer"
          onClick={(e) => {
            const rect = (e.target as HTMLDivElement).getBoundingClientRect();
            const percentage = ((e.clientX - rect.left) / rect.width) * 100;
            seekTo(percentage);
          }}
        >
          <div
            className="h-full bg-[#B059F6FF] rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={isPlaying ? pause : play}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
        >
          {isPlaying ? <Pause className="text-black" /> : <Play className="text-black" />}
        </button>
        <button
          onClick={clearSong}
          className="text-sm bg-red-600 text-white px-2 py-1 rounded"
        >
          Cancel
        </button>
      </div>

      <div className="hidden">
        <div ref={containerRef} />
      </div>
    </div>
  );
};
