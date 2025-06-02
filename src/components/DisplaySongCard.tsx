import { useEffect, useRef, useState } from "react";
import Play from "../assets/icons/play.svg?react";
import Pause from "../assets/icons/pause.svg?react";
import Add from "../assets/icons/add.svg?react";
import Check from "../assets/icons/check.svg?react";
import { Song } from "../types/playList.types.ts";

export const DisplaySongCard = ({
  songData,
  idx,
}: {
  songData: any;
  idx: number;
}) => {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      intervalRef.current = window.setInterval(() => {
        const current = playerRef.current.getCurrentTime();
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

  const onYouTubeIframeAPIReady = () => {
    playerRef.current = new YT.Player(`yt-player-${songData.videoId}`, {
      videoId: songData.videoId,
      events: {
        onReady: () => {
          setIsPlayerReady(true);
        },
        onStateChange: onPlayerStateChange,
      },
    });
  };

  /*useEffect(() => {
    // Wait for global YT to be defined
    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
  }, []);*/

  useEffect(() => {
    const interval = setInterval(() => {
      const playerDiv = document.getElementById(
        `yt-player-${songData.videoId}`,
      );
      if (window.YT?.Player && playerDiv && !playerRef.current) {
        clearInterval(interval);
        playerRef.current = new YT.Player(`yt-player-${songData.videoId}`, {
          videoId: songData.videoId,
          events: {
            onReady: () => setIsPlayerReady(true),
            onStateChange: onPlayerStateChange,
          },
        });
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const seekTo = (percentage: number) => {
    const duration = playerRef.current.getDuration();
    playerRef.current.seekTo((percentage / 100) * duration, true);
  };

  const playSong = () => {
    console.log("Player ref:", playerRef.current);
    if (isPlayerReady && playerRef.current?.playVideo) {
      playerRef.current.playVideo();
    } else {
      console.warn("Player not ready yet");
    }
  };
  const pauseSong = () => playerRef.current.pauseVideo();

  /*const playSong = async () => {
    const allIframes = document.querySelectorAll('iframe[id^="yt-player-"]');

    // Pause all other players
    allIframes.forEach((iframe) => {
      const id = iframe.getAttribute('id');
      if (id !== `yt-player-${songData.videoId}`) {
        (iframe as HTMLIFrameElement).contentWindow?.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*'
        );
      }
    });

    // Play this player
    const current = document.getElementById(`yt-player-${songData.videoId}`) as HTMLIFrameElement;
    current?.contentWindow?.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      '*'
    );
  }*/

  const addSongToPlaylist = async (song: Song) => {
    const playlistId = prompt("Enter playlist ID to add to:"); // or use modal
    if (!playlistId) return;

    await fetch(`https:/localhost:3000/api/playlists/${playlistId}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(song),
    });

    alert("Added!");
  };

  return (
    <div className={"px-4 py-0"}>
      <div
        key={idx}
        className="border-1 border-blue-400 flex items-center justify-between gap-4 p-4 px-12 rounded-xl  bg-transparent hover:shadow-lg transition"
      >
        <div>
          <img
            src={`https://i.ytimg.com/vi/${songData.videoId}/mqdefault.jpg`}
            alt={songData.title}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className={"flex flex-col"}>
            {/* Song Info */}
            <div className="flex flex-col flex-grow">
              <div className="text-lg font-semibold">{songData.title}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
                  alt="YouTube"
                  className="w-12 h-auto"
                />
                <span className="text-xs text-gray-400">YouTube Music</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div>isPlaying is {isPlaying}</div>
            {isPlaying && (
              <div
                className="h-2 bg-gray-600 rounded mt-2 cursor-pointer border-red-700 border-2"
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
                  className="h-full bg-green-400 rounded"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
        <div className={"flex gap-4"}>
          <div
            onClick={() => addSongToPlaylist(songData)}
            className={
              "bg-[#B059F6] rounded-full w-12 h-12 flex items-center justify-center cursor-pointer"
            }
          >
            <div
              className={
                "bg-white rounded-full w-6 h-6 flex items-center justify-center"
              }
            >
              {!isPlaying ? (
                <Add className={"text-black"} />
              ) : (
                <Check className={"text-black"} />
              )}
            </div>
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

          {/*<div className="flex gap-2">
            <button onClick={playSong} className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">▶</button>
            <button onClick={pauseSong} className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition">⏸</button>
          </div>*/}
        </div>

        {/* Controls */}
        {/*<div className="flex gap-2">
          <button
            onClick={playSong}
            className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            ▶ Play
          </button>

          <button
            onClick={() => {
              const player = document.getElementById(`yt-player-${songData.videoId}`) as HTMLIFrameElement;
              player?.contentWindow?.postMessage(
                '{"event":"command","func":"pauseVideo","args":""}',
                '*'
              );
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
          >
            ⏸ Pause
          </button>
        </div>*/}
        {/* Controls */}
      </div>
      {/* Thumbnail */}

      {/* Hidden YouTube Player */}
      <div className="hidden">
        <div id={`yt-player-${songData.videoId}`}></div>
      </div>
    </div>
  );
};
