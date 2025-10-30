import {
  musicPlayerStore,
  useMusicPlayerStore,
} from "../hooks/stores/useMusicPlayerStore.ts";
import { MusicPlayerManager } from "../utils/MusicPlayerManager.ts";
import { Song } from "../types/youtube.types.ts";
import Add from "../assets/icons/add.svg?react";
import Remove from "../assets/icons/remove.svg?react";
import Play from "../assets/icons/play.svg?react";
import Pause from "../assets/icons/pause.svg?react";
import { useAccountStore } from "../hooks/stores/useAccountStore.ts";
import { useSavedMap, useToggleSave } from "../hooks/query/library.queries.ts";
import { useEffect } from "react";

export type YtTrackHandle = {
  play: () => void;
  pause: () => void;
  prime: () => Promise<void>; // mute -> play -> brief wait -> pause (used before UI)
};

type Props = {
  song: Song;
  allTracks: Array<any>;
};

export const DisplayYoutubeSongCard = ({ song, allTracks }: Props) => {
  const currentSong = useMusicPlayerStore((s) => s.currentSong);
  const isPlaying = useMusicPlayerStore((s) => s.isPlaying);
  const setIsPlaying = useMusicPlayerStore((s) => s.setIsPlaying);
  const setQueue = useMusicPlayerStore((s) => s.setQueue);
  const isCurrent = currentSong?.audioId === song.audioId;
  const isPlayingCurrent = isCurrent && isPlaying;
  const set = musicPlayerStore.setState;

  /* useEffect(() => {
    setQueue(allTracks);
  }, [allTracks]); */

  const handleClick = async () => {
    console.log("click");
    if (!isCurrent) {
      console.log("not current");
      MusicPlayerManager.pause(); // pause whatever was playing
      console.log("setting song", song);
      set({
        provider: "youtube",
        isPlaying: true,
        currentSong: song,
      });
      setQueue(allTracks);
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

  const profile = useAccountStore((s) => s.profile);
  const address = profile.address || "";
  // const queue = useMusicPlayerStore((s) => s.queue);
  const audioId = song?.audioId || "";

  const batchKeyIds = allTracks.map((s) => s.audioId);
  // console.log("batchedkeyIds", batchKeyIds);
  const { data: savedMap } = useSavedMap(address, "track", batchKeyIds);
  // console.log("savedMap", savedMap);
  const isSaved = savedMap?.[audioId] ?? false;
  // console.log("for isSaved", savedMap, audioId);
  // console.log("isSaved footer", isSaved);
  const { mutate, isPending, data, error } = useToggleSave();

  const handleAddToLibrary = () => {
    console.log("library");
    if (song) {
      if (isSaved) {
        console.log("removing");
        mutate({
          videoId: song.audioId,
          address: profile.address || "",
          action: "remove",
          kind: "track",
        });
      } else {
        // console.log("adding");
        mutate({
          videoId: song.audioId,
          address: profile.address || "",
          action: "add",
          kind: "track",
        });
      }
    }
  };

  return (
    <div
      className={`p-2 px-0 mx-2 flex items-center gap-4 border-t-2 ${
        isPlayingCurrent ? "border-[#B065A0] animate-pulse" : "border-gray-500"
      }`}
    >
      {/* Custom UI (thumbnail and overlay button) */}
      <div className="relative rounded-md group flex-shrink-0">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-12 h-12 object-cover rounded-md"
        />

        <button
          onClick={handleClick}
          className="absolute top-1/2 left-1/2 -translate-x-1/2
                       -translate-y-1/2 text-white opacity-0 group-hover:opacity-100
                       transition-opacity"
          aria-label={isPlayingCurrent ? "Pause" : "Play"}
        >
          {isPlayingCurrent ? (
            <Pause width={40} height={40} />
          ) : (
            <Play width={40} height={40} />
          )}
        </button>
      </div>
      <div className="flex-grow">
        <div className="font-semibold line-clamp-1">{song.title}</div>
        <div className="text-sm text-gray-300 line-clamp-1">
          {song.channelTitle}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAddToLibrary();
        }}
        className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
      >
        {isSaved ? <Remove /> : <Add />}
      </button>
    </div>
  );
};
