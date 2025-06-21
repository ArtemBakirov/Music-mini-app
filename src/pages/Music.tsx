import { useEffect, useState, useRef } from "react";
import { SearchInput } from "../components/SearchInput.tsx";
import { DisplaySongCard } from "../components/DisplaySongCard.tsx";
import { SdkService } from "../bastyon-sdk/sdkService.ts";
import {useInfiniteYoutubeSearch, usePlaylistSongs} from "../hooks/query/playlist.queries.ts";

// zustand store for selected playList
import { useViewStore } from "../hooks/stores/useViewStore";

export default function Music() {
  useEffect(() => {
    void SdkService.init();
    console.log("testing sending notifications");
    void SdkService.requestPermissions();
    void SdkService.getUsersInfo();
  }, []);

  const [query, setQuery] = useState(""); // User typing
  const [searchQuery, setSearchQuery] = useState(""); // Final submitted query
// zustand
  const { viewMode, searchQuery, selectedPlaylistId } = useViewStore();

  // react-query hooks
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteYoutubeSearch(searchQuery);

  const { data: playlistSongs } = usePlaylistSongs(selectedPlaylistId);
 //


  console.log("data is", data);
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
        {data &&
          data?.pages.map((page, i) =>
            page.items.map((item, idx) => {
              const isLastItem =
                i === data.pages.length - 1 && idx === page.items.length - 1;
              return (
                <>
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
                </>
              );
            }),
          )}
      </div>

      {/* <div ref={observerRef} className="h-10" /> */}

      {isFetchingNextPage && <div>Loading more...</div>}
    </div>
  );
}
