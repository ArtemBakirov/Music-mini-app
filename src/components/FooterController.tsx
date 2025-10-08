import Play from "../assets/icons/play.svg?react";
import Pause from "../assets/icons/pause.svg?react";
import Next from "../assets/icons/next.svg?react";
import Prev from "../assets/icons/prev.svg?react";
import Repeat from "../assets/icons/repeat.svg?react";
import Shuffle from "../assets/icons/shuffle.svg?react";
import { RepeatMode } from "../hooks/stores/useMusicPlayerStore.ts";
import { useDesktopMobileStore } from "../hooks/stores/useDesktopMobileStore.ts";

export const FooterController = ({
  isPlaying,
  onPlayPauseClick,
  onNextClick,
  onPrevClick,
  onShuffleClick,
  onRepeatClick,
  shuffleActive,
  repeatMode,
}: {
  onPlayPauseClick: () => void;
  isPlaying: boolean;
  onNextClick: () => void;
  onPrevClick: () => void;
  onShuffleClick: () => void;
  onRepeatClick: () => void;
  shuffleActive: boolean;
  repeatMode: RepeatMode;
}) => {
  const repeatLabel =
    repeatMode === "off" ? "" : repeatMode === "one" ? "1" : "∞";

  const isMobile = useDesktopMobileStore((s) => s.isMobile);

  if (!isMobile) {
    return (
      <div className="flex items-center justify-center gap-6">
        {/* Shuffle */}
        <button
          onClick={onShuffleClick}
          className={`p-2 rounded-full hover:bg-[#3a1a4d] transition ${
            shuffleActive ? "bg-[#3a1a4d]" : ""
          }`}
          title="Shuffle"
        >
          <Shuffle /> {/* Replace with your SVG import */}
        </button>

        {/* Previous */}
        <button
          onClick={onPrevClick}
          className="p-2 rounded-full hover:bg-[#3a1a4d] transition"
        >
          <Prev /> {/* Replace with your SVG import */}
        </button>

        {/* Play / Pause */}
        <button
          onClick={onPlayPauseClick}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause /> : <Play />}
        </button>

        {/* Next */}
        <button
          onClick={onNextClick}
          className="p-2 rounded-full hover:bg-[#3a1a4d] transition"
        >
          <Next /> {/* Replace with your SVG import */}
        </button>

        {/* Repeat */}
        <button
          onClick={onRepeatClick}
          className={`relative p-2 rounded-full hover:bg-[#3a1a4d] transition ${
            repeatMode !== "off" ? "bg-[#3a1a4d]" : ""
          }`}
          title={`Repeat: ${repeatMode}`}
        >
          <Repeat />
          {repeatMode !== "off" && (
            <span className="absolute -bottom-1 -right-1 text-[10px] bg-white text-black rounded px-1 leading-none">
              {repeatLabel}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-6">
      {/* Previous */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevClick();
        }}
        className="p-2 rounded-full hover:bg-[#3a1a4d] transition"
      >
        <Prev />
      </button>

      {/* Play / Pause */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlayPauseClick();
        }}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
      >
        {isPlaying ? <Pause /> : <Play />}
      </button>

      {/* Next */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNextClick();
        }}
        className="p-2 rounded-full hover:bg-[#3a1a4d] transition"
      >
        <Next />
      </button>
    </div>
  );
};
