import { useEffect, useState, useRef } from "react";
import "./Music.css";
import { SdkService } from "../bastyon-sdk/sdkService.ts";
import {
  useInfiniteYoutubeSearch,
  usePlaylistSongs,
} from "../hooks/query/playlist.queries.ts";

// zustand store for selected playList
import { useViewStateStore } from "../hooks/stores/useViewStateStore";

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

  useEffect(() => {
    const fetchTracks = async () => {
      const res = await fetch(
        "https://api.jamendo.com/v3.0/tracks/?client_id=17ed92bf&format=json&limit=10&fuzzytags=chill",
      );
      const data = await res.json();
      console.log(data);
    };
    fetchTracks();
  }, []);

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
        </div>
      </div>
    </>
  );
}
