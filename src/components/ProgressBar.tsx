import { useJamendoPlayerStore } from "../hooks/stores/useJamendoPlayerStore";
import { JamendoPlayerManager } from "../utils/JamendoPlayerManager";

export const ProgressBar = () => {
  const progress = useJamendoPlayerStore((s) => s.progress);

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
    </div>
  );
};
