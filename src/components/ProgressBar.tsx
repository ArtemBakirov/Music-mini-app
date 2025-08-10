import { useJamendoPlayerStore } from "../hooks/stores/useJamendoPlayerStore";
import { JamendoPlayerManager } from "../utils/JamendoPlayerManager";

const formatTime = (seconds: number) => {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${m}:${sec < 10 ? "0" : ""}${sec}`;
};

export const ProgressBar = () => {
  /*const { progress, duration, currentTime } = useJamendoPlayerStore((st) => ({
    progress: st.progress,
    duration: st.duration,
    currentTime: st.currentTime,
  })); */

  const progress = useJamendoPlayerStore((s) => s.progress);
  const duration = useJamendoPlayerStore((s) => s.duration);
  const currentTime = useJamendoPlayerStore((s) => s.currentTime);

  /*const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef?.current) return;

    const bar = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - bar.left;
    const width = bar.width;
    const percentage = clickX / width;

    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    // console.log("set progress", percentage * 100);
    setProgress(percentage * 100);
  }; */
  // console.log("progress is", progress);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    JamendoPlayerManager.seekTo(pct);
  };

  return (
    <div className="w-full flex flex-col items-start">
      <div
        className="w-full h-2 bg-gray-500 rounded cursor-pointer"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-purple-500 rounded"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-300 mt-1">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};
