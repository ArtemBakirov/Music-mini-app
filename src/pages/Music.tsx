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
    status,
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
      <h2>Search music</h2>
      <div className={"w-[80%]"}>
        <SearchInput onClick={handleSearch} query={query} setQuery={setQuery} />
      </div>

      <button onClick={handleSearch}>Search</button>
      <div className={"flex flex-col gap-4 padding-2 overflow-y-scroll"}>
        {viewMode === "search" && searchResults ? (
          searchResults?.pages.map((page, i) =>
            page.items.map((item: any, idx: any) => {
              const isLastItem =
                i === searchResults.pages.length - 1 &&
                idx === page.items.length - 1;
              return (
                <div key={idx}>
                  <DisplaySongCard
                    songData={item}
                    idx={idx}
                    key={item.videoId || idx}
                  />
                  {isLastItem && (
                    <div
                      ref={observerRef}
                      className="h-6 border-2 border-purple-700"
                    />
                  )}
                </div>
              );
            }),
          )
        ) : (
          <>
            {playlistResults &&
              playlistResults?.songs &&
              playlistResults.songs.map((item: any, idx: any) => {
                return (
                  <>
                    <DisplaySongCard
                      songData={item}
                      idx={idx}
                      key={item.videoId || idx}
                    />
                    {/*isLastItem && (
                  <div
                    ref={observerRef}
                    className="h-6 border-2 border-purple-700"
                  />
                )*/}
                  </>
                );
              })}
          </>
        )}
      </div>

      {/* <div ref={observerRef} className="h-10" /> */}

      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
}
