import { useEffect, useRef, useState } from "react";
import Play from "../assets/icons/play.svg?react";
import Pause from "../assets/icons/pause.svg?react";
import Add from "../assets/icons/add.svg?react";

import { AddSongToolBar } from "./AddSongToolBar.tsx";
import {
  usePlaylists,
  useAddSongToPlaylist,
  useAllUserSongIds,
} from "../hooks/query/playlist.queries.ts";
import { useMusicPlayerStore } from "../hooks/stores/useMusicPlayerStore.ts";

// global player manager
import { youtubePlayerManager } from "../utils/YoutubePlayerManager";

export const DisplaySongCard = ({
  songData,
  idx,
}: {
  songData: any;
  idx: number;
}) => {
  // player reference
  const playerRef = useRef<any>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const intervalRef = useRef<number | null>(null);
  const [showToolbar, setShowToolbar] = useState(false); // fetched playlists

  // is seeking state to show the progressbar while seeking to the another part of audio
  const [isSeeking, setIsSeeking] = useState(false);

  // react-query hooks
  const { data: playlists } = usePlaylists("test_address");
  const { data: allSongsIds } = useAllUserSongIds("test_address");
  const { mutate: addSong } = useAddSongToPlaylist();

  const [videoId, setVideoId] = useState("8mGBaXPlri8");
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&rel=0`;

  // zustand state of the current playing song
  const {
    currentSong,
    isPlaying,
    progress,
    setCurrentSong,
    setIsPlaying,
    setProgress,
    // setPlayer,
    // player,
  } = useMusicPlayerStore();
  const isActive = currentSong?.videoId === songData.videoId;

  useEffect(() => {
    if (!containerRef.current || currentSong?.videoId !== songData.videoId)
      return;

    const interval = setInterval(() => {
      if (window.YT?.Player && containerRef.current && !playerRef.current) {
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      // Optionally clean up the player
      if (playerRef.current?.destroy) {
        youtubePlayerManager.destroy();
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentSong]);

  useEffect(() => {
    // Auto-pause this song if it's no longer the current
    if (currentSong?.videoId !== songData.videoId && isPlaying) {
      pauseSong();
    }
  }, [currentSong]);

  const seekTo = (percentage: number) => {
    setIsSeeking(true);
    // const duration = playerRef.current.getDuration();
    youtubePlayerManager.seekTo(percentage);
  };

  /* const playSong = () => {
    if (!isActive) {
      setCurrentSong(songData);
      setTimeout(async () => {
        if (!containerRef.current) return;

        await youtubePlayerManager.initPlayer(
          containerRef.current,
          songData.videoId,
          (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              const interval = setInterval(() => {
                setProgress(youtubePlayerManager.getProgress());
              }, 500);
              return () => clearInterval(interval);
            } else {
              setIsPlaying(false);
            }
          },
          progress,
        );

        youtubePlayerManager.play(); // ✅ now the player is ready
      }, 0);
      // youtubePlayerManager.play();
    } else if (youtubePlayerManager.play) {
      console.log("play");
      youtubePlayerManager.play();
    } else {
      console.warn("Player not ready yet");
    }
  }; */

  const playSong = () => {
    setIsPlaying(true);
  };

  const pauseSong = () => youtubePlayerManager.pause();

  const handleAddClick = () => setShowToolbar((prev) => !prev);

  const handleSelectPlaylist = async (playlistId: string) => {
    addSong({
      playlistId,
      song: songData,
      ownerId: "test_address",
    });
    setShowToolbar(false);
    // Optional: Update local store to reflect change
  };

  return (
    <div key={idx} className={"px-4 py-0"}>
      <div className="relative border-2 border-purple-700 flex items-center justify-between gap-4 p-4 px-12 rounded-xl  bg-transparent hover:shadow-lg transition">
        <div className={"flex items-center justify-start gap-4 w-full"}>
          <img
            src={`https://i.ytimg.com/vi/${songData.videoId}/mqdefault.jpg`}
            alt={songData.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className={"flex flex-col"}>
            {/* Song Info */}
            <div className="flex flex-col flex-grow">
              <div className="text-lg font-semibold">{songData.title}</div>
            </div>

            {/* Progress Bar */}
            {isActive && (isPlaying || isSeeking) && (
              <div
                className="absolute w-100 top-18 h-2 bg-[#2D0F3AFF] rounded mt-2 cursor-pointer"
                onClick={(e) => {
                  const rect = (
                    e.target as HTMLDivElement
                  ).getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const width = rect.width;
                  const percentage = (clickX / width) * 100;
                  seekTo(percentage);
                }}
              >
                <div
                  className="h-full bg-[#B059F6FF] rounded"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        <div className={"flex gap-4"}>
          <div
            onClick={handleAddClick}
            className={
              "bg-[#B059F6] rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
            }
          >
            <div
              className={
                "bg-white rounded-full w-6 h-6 flex items-center justify-center"
              }
            >
              <Add className={"text-black"} />
            </div>
            {showToolbar && (
              <AddSongToolBar
                allSongsIds={allSongsIds}
                playlists={playlists}
                songId={songData.videoId}
                onSelect={handleSelectPlaylist}
                onClose={() => setShowToolbar(false)}
              />
            )}
          </div>
          <div
            onClick={isActive && isPlaying ? pauseSong : playSong}
            className={
              "bg-[#B059F6] rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
            }
          >
            <div
              className={
                "bg-white rounded-full w-6 h-6 flex items-center justify-center"
              }
            >
              {isActive && isPlaying ? (
                <Pause className={"text-black"} />
              ) : (
                <Play className={"text-black"} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden YouTube Player */}
      <div className="hidden">
        {/*  <div id={`yt-player-${songData.videoId}`}></div> */}
        {/* Bastyon currently block the youtube player, I suppose because of the iframe's sandbox - it must have allow-presentation flag */}
        {/* SecurityError: The document is sandboxed and lacks the 'allow-presentation' flag. That is why it is not possible to use the official player currently */}
        {isPlaying && (
          <div className="border-2 border-black text-black">
            Here is the hidden player
            <iframe
              width="100%"
              height="100"
              src={embedUrl}
              allow="autoplay; encrypted-media"
              title="YouTube video player"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}
        {/* <div ref={containerRef} /> */}
      </div>
    </div>
  );
};
