import { useEffect, useState, useRef } from "react";
import { SearchInput } from "../components/SearchInput.tsx";
import { DisplaySongCard } from "../components/DisplaySongCard.tsx";
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

  return (
    <div
      className={
        " bg-[#371A4D] h-screen p-4 pt-12 w-full flex flex-col gap-4 items-center text-white"
      }
    >
      DOES THIS WORK??
      {/* <div ref={observerRef} className="h-10" /> */}
      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
}
