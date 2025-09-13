import { useMusicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
import { MusicPlayerManager } from "../utils/MusicPlayerManager.ts";

export const ProgressBar = () => {
  const progress = useMusicPlayerStore((s) => s.progress);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    MusicPlayerManager.seekTo(pct);
  };

  return (
    <div className="w-[80%] flex flex-col items-start">
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
