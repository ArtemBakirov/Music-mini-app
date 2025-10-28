// pages/YouTubeArtists.tsx
import { useMemo, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  useYouTubeChannelPlaylistsInfinite,
  useYouTubePlaylistsInfinite,
} from "../../hooks/query/youtube.queries.ts";
import { RenderAlbums } from "./RenderAlbums.tsx";
import { Mode } from "../../types/youtube.types.ts";

export default function RenderInfiniteAlbums() {
  const YT_API_KEY =
    import.meta.env.VITE_YT_API_KEY ||
    "AIzaSyCUpYD21lRefE6F_WuO993Z4ityPj3aQdw";
  const { query = "", channelId = "", mode = "" } = useParams();
  console.log("query", query);
  console.log("channelId", channelId);

  /* const {
    data: albumsData,
    isLoading: isAlbumsLoading,
    error: isAlbumsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useYouTubeChannelPlaylistsInfinite(YT_API_KEY, query, 24); */

  const {
    data: albumsData,
    isLoading: isAlbumsLoading,
    error: isAlbumsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useYouTubePlaylistsInfinite(YT_API_KEY, query, channelId, 24);

  // load first page when query changes
  const albums = useMemo(
    () => albumsData?.pages.flatMap((p) => p.items) ?? [],
    [albumsData],
  );

  // IntersectionObserver sentinel to load more
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { root: null, rootMargin: "300px 0px", threshold: 0 },
    );

    io.observe(el);
    return () => io.unobserve(el);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  console.log("render mode", mode);

  if (!query && !channelId) return <div className="p-6 mt-16">No query.</div>;

  return (
    <div className="h-screen overflow-hidden w-full flex flex-col p-6 mt-16 gap-6 bg-[#371A4D] text-white">
      <div className="flex-1 overflow-y-auto pb-24 relative">
        {albums && (
          <RenderAlbums mode={mode as Mode} query={query} albums={albums} />
        )}
        {isAlbumsLoading && (
          <div className="space-y-6">
            <div className="h-6 w-40 bg-[#1f1f1f] rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-[#1f1f1f] rounded-md animate-pulse"
                />
              ))}
            </div>
          </div>
        )}
        {isAlbumsError && (
          <div className="py-10 text-center text-red-300">
            {(isAlbumsError as Error)?.message || "Failed to load albums"}
          </div>
        )}
        <div
          ref={sentinelRef}
          className="h-10 flex items-center justify-center"
        >
          {isFetchingNextPage ? (
            <span className="text-sm opacity-70">Loading more…</span>
          ) : !hasNextPage && albums.length > 0 ? (
            <span className="text-xs opacity-50">No more results</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
