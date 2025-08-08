import { useEffect, useState, useRef } from "react";
import "./Music.css";
import { SearchInput } from "../components/SearchInput.tsx";
import { DisplaySongCard } from "../components/DisplaySongCard.tsx";
import { SdkService } from "../bastyon-sdk/sdkService.ts";
import {
  useInfiniteYoutubeSearch,
  usePlaylistSongs,
} from "../hooks/query/playlist.queries.ts";

// zustand store for selected playList
import { useViewStateStore } from "../hooks/stores/useViewStateStore";
import YouTube from "react-youtube";

export default function Music() {
  useEffect(() => {
    void SdkService.init();
    console.log("testing sending notifications");
    void SdkService.requestPermissions();
    void SdkService.getUsersInfo();
  }, []);
  // look for the iframe
  const iframeEls = document.getElementsByName("iframe");
  iframeEls.forEach((iframe) => {
    console.log("iframe found", iframe);
  });

  const [query, setQuery] = useState(""); // User typing
  // const [searchQuery, setSearchQuery] = useState(""); // Final submitted query

  // zustand for switch between search music and show playList
  const {
    viewMode,
    searchQuery,
    selectedPlaylistId,
    setSearchQuery,
    showSearchResults,
  } = useViewStateStore();

  // react-query hooks
  const {
    data: searchResults,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteYoutubeSearch(searchQuery);

  const { data: playlistResults } = usePlaylistSongs(selectedPlaylistId);
  console.log("search results", searchResults);
  //
  /*const songsDataToShow = viewMode === "search"
    ? searchResults : playlistResult || []; */

  // console.log("data is", data);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  const observerRef = (node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (node) {
      observer.current.observe(node);
      lastElementRef.current = node;
    }
  };

  const handleSearch = () => {
    showSearchResults();
    if (query.trim()) {
      setSearchQuery(query); // Triggers the query hook
    }
  };
  const videoId = "8mGBaXPlri8";
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=1&rel=0`;

  const [isPlaying, setIsPlaying] = useState(false);
  // const [isPaused, setIsPaused] = useState(false);
  //const [passedTime, setPassedTime] = useState(0); // in seconds
  /*const [startTime, setStartTime] = useState(0);
  const playbackTimer = useRef<number | null>(null);
  const playbackStartTimestamp = useRef<number | null>(null); // in ms*/

  /*const iframeSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1&rel=0&start=${Math.floor(
    startTime,
  )}`;*/

  /*useEffect(() => {
    if (isPlaying) {
      playbackStartTimestamp.current = Date.now();

      playbackTimer.current = window.setInterval(() => {
        const now = Date.now();
        const elapsedSeconds =
          (now - (playbackStartTimestamp.current || now)) / 1000;
        setPassedTime((prevTime) => prevTime + elapsedSeconds);
        playbackStartTimestamp.current = now;
      }, 1000);
    }
    return () => {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
        playbackTimer.current = null;
      }
    };
  }, [isPlaying]);*/

  const play = () => {
    setIsPlaying(true);
  };
  const stop = () => {
    setIsPlaying(false);
    // setStartTime(0);
  };

  /*const pause = () => {
    setIsPlaying(false);
    // setIsPaused(true);
    setStartTime(passedTime);
  };*/

  return (
    <>
      <div
        className={
          " bg-[#371A4D] h-screen p-4 pt-12 w-full flex flex-col gap-4 items-center text-white"
        }
      >
        <div>
          <p className={"testing-iframe"}>
            This is a component for testing the iframe from youtube
          </p>
          IT SHOULD WORK LIKE THIS
          {isPlaying && (
            <iframe
              width="100%"
              height="100"
              src={embedUrl}
              allow="autoplay; encrypted-media"
              title="YouTube video player"
              frameBorder="0"
              allowFullScreen
            />
          )}
          {/*<div className="flex gap-4">
          <button onClick={play}>Play Iframe</button>
          <button onClick={stop}>Stop Iframe</button>
           <button onClick={pause}>Pause Iframe</button>
        </div>*/}
          {/* <p className="text-sm text-gray-400 border-1 border- black mt-6">
          Approx. current time: {Math.floor(passedTime)} seconds
        </p> */}
        </div>
      </div>
    </>
  );
}
