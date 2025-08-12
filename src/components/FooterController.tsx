import Play from "../assets/icons/play.svg?react";
import Pause from "../assets/icons/pause.svg?react";
import Next from "../assets/icons/next.svg?react";
import Prev from "../assets/icons/prev.svg?react";
import Repeat from "../assets/icons/repeat.svg?react";
import Shuffle from "../assets/icons/shuffle.svg?react";

export const FooterController = ({
  isPlaying,
  onPlayPauseClick,
}: {
  onPlayPauseClick: () => void;
  isPlaying: boolean;
}) => {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Shuffle */}
      <button className="p-2 rounded-full hover:bg-[#3a1a4d] transition">
        <Shuffle /> {/* Replace with your SVG import */}
      </button>

      {/* Previous */}
      <button className="p-2 rounded-full hover:bg-[#3a1a4d] transition">
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
      <button className="p-2 rounded-full hover:bg-[#3a1a4d] transition">
        <Next /> {/* Replace with your SVG import */}
      </button>

      {/* Repeat */}
      <button className="p-2 rounded-full hover:bg-[#3a1a4d] transition">
        <Repeat /> {/* Replace with your SVG import */}
      </button>
    </div>
  );
};
