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
import { usePlayerStore } from "../hooks/stores/usePlayerStore.ts";

export const DisplaySongCard = ({
  songData,
  idx,
}: {
  songData: any;
  idx: number;
}) => {
  const playerRef = useRef<any>(null);

  // player ref
  const containerRef = useRef<HTMLDivElement | null>(null);

  // const [isPlaying, setIsPlaying] = useState(false);
  // const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false); // fetched playlists

  // is seeking state to show the progressbar while seeking to the another part of audio
  const [isSeeking, setIsSeeking] = useState(false);

  // react-query hooks
  const { data: playlists } = usePlaylists("test_address");
  const { data: allSongsIds } = useAllUserSongIds("test_address");
  const { mutate: addSong } = useAddSongToPlaylist();

  // zustand state of the current playing song
  const {
    currentSong,
    isPlaying,
    progress,
    setCurrentSong,
    setIsPlaying,
    setProgress,
    setPlayer,
    player,
  } = usePlayerStore();
  const isActive = currentSong?.videoId === songData.videoId;

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    console.log("Player state changed:", event.data);
    if (event.data === YT.PlayerState.PLAYING) {
      console.log("Player is playing");
      if (isSeeking) {
        setIsSeeking(false); // Clear seeking when playback resumes
      }
      setIsPlaying(true);
      intervalRef.current = window.setInterval(() => {
        console.log("Player ref?:", playerRef.current);
        const current = playerRef.current.getCurrentTime();
        console.log("Current time:", current);
        // Uncaught TypeError: playerRef.current.getCurrentTime is not a function
        const total = playerRef.current.getDuration();
        setProgress((current / total) * 100);
      }, 500);
    } else {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current || currentSong?.videoId !== songData.videoId) return;

    const interval = setInterval(() => {
      /*const playerDiv = document.getElementById(
        `yt-player-${songData.videoId}`,
      );*/
      if (window.YT?.Player && containerRef.current && !playerRef.current) {
        clearInterval(interval);
        console.log("creating new player");
        playerRef.current = new YT.Player(containerRef.current, {
          videoId: songData.videoId,
          events: {
            onReady: () => {
              setPlayer(playerRef.current);
              setIsPlayerReady(true)
            },
            onStateChange: onPlayerStateChange,
          },
        });
      }
    }, 200);

    return () => {
      clearInterval(interval);
      // Optionally clean up the player
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
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
    const duration = player.current.getDuration();
    player.seekTo((percentage / 100) * duration, true);
  };

  const playSong = () => {
    // console.log("Player ref:", playerRef.current);
    // update global stored current song id
    if (!isActive && (currentSong?.videoId !== songData.videoId)) {
      setCurrentSong(songData); // this updates the footer and pauses others
    } else{
      player?.playVideo();
    }

    if (isPlayerReady && playerRef.current?.playVideo) {
      playerRef.current.playVideo();
    } else {
      console.warn("Player not ready yet");
    }
  };
  const pauseSong = () => player.pauseVideo();

  const handleAddClick = () => setShowToolbar((prev) => !prev);

  const handleSelectPlaylist = async (playlistId: string) => {
    addSong({
      playlistId,
      song: songData,
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
            {(isPlaying || isSeeking) && (
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
            onClick={isPlaying ? pauseSong : playSong}
            className={
              "bg-[#B059F6] rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
            }
          >
            <div
              className={
                "bg-white rounded-full w-6 h-6 flex items-center justify-center"
              }
            >
              {isPlaying ? (
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
        <div ref={containerRef} />
      </div>
    </div>
  );
};
