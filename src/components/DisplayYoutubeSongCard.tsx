import { useRef, useState } from "react";
import { YouTubeProps } from "react-youtube";
import { useMusicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";
import { MusicPlayerManager } from "../utils/MusicPlayerManager.ts";

export type YtTrackHandle = {
  play: () => void;
  pause: () => void;
  prime: () => Promise<void>; // mute -> play -> brief wait -> pause (used before UI)
};

type Props = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  allTracks: Array<any>;
  idx: number;
  track: any;
};

export const DisplayYoutubeSongCard = ({
  videoId,
  title,
  channelTitle,
  thumbnail,
  allTracks,
  idx,
}: Props) => {
  const [isReady, setIsReady] = useState(true);

  const currentSong = useMusicPlayerStore((s) => s.currentSong);
  const isPlaying = useMusicPlayerStore((s) => s.isPlaying);
  const setCurrentSong = useMusicPlayerStore((s) => s.setCurrentSong);
  const setIsPlaying = useMusicPlayerStore((s) => s.setIsPlaying);
  const setQueue = useMusicPlayerStore((s) => s.setQueue);
  const playAt = useMusicPlayerStore((s) => s.playAt);
  const setProvider = useMusicPlayerStore((s) => s.setProvider);
  const isCurrent = currentSong?.id === videoId;
  const isPlayingCurrent = isCurrent && isPlaying;

  console.log("is playing", isPlaying);

  const handleClick = async () => {
    if (!isCurrent) {
      // console.log("not current");
      setQueue(allTracks);
      MusicPlayerManager.pause(); // pause whatever was playing
      // console.log("setting provider");
      setProvider("youtube");
      setCurrentSong({
        name: title,
        album_image: thumbnail,
        audio: videoId,
      }); // switch song in store

      setIsPlaying(true); // footer effect will call syncToState()
      playAt(idx);
    } else {
      if (isPlaying) {
        MusicPlayerManager.pause();
        setIsPlaying(false);
      } else {
        MusicPlayerManager.resume();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div
      className={`p-2 px-0 mx-2 flex items-center gap-4 border-t-2 ${
        isPlayingCurrent ? "border-[#B065A0] animate-pulse" : "border-gray-500"
      }`}
    >
      {/* Custom UI (thumbnail + overlay button) */}
      <div className="relative rounded-md group flex-shrink-0">
        <img
          src={thumbnail}
          alt={title}
          className="w-12 h-12 object-cover rounded-md"
        />
        {isReady ? (
          <button
            onClick={handleClick}
            className="absolute top-1/2 left-1/2 -translate-x-1/2
                       -translate-y-1/2 text-white opacity-0 group-hover:opacity-100
                       transition-opacity"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlayingCurrent ? (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        ) : (
          <div
            className="animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2
                       -translate-y-1/2 text-white
                       transition-opacity"
          >
            Loading...
          </div>
        )}
      </div>

      <div className="flex-grow">
        <div className="font-semibold line-clamp-1">{title}</div>
        <div className="text-sm text-gray-300 line-clamp-1">{channelTitle}</div>
      </div>
    </div>
  );
};
