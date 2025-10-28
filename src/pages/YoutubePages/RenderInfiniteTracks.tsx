import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useYouTubeTracksInfinite } from "../../hooks/query/youtube.queries";
import { RenderTracks } from "./RenderTracks";
import { Mode } from "../../types/youtube.types.ts";

const YT_API_KEY =
  import.meta.env.VITE_YT_API_KEY || "AIzaSyCUpYD21lRefE6F_WuO993Z4ityPj3aQdw";

export default function RenderInfiniteTracks() {
  const { query = "", channelId = "", mode = "" } = useParams();
  console.log("channelid", channelId);
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useYouTubeTracksInfinite(
    YT_API_KEY,
    decodeURIComponent(query),
    channelId,
    24,
  );

  // flatten pages -> an array of videos
  const videos = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const tracks = videos.map(({ id, ...rest }, idx) => {
    return {
      ...rest,
      audioId: id,
    };
  });

  // Keep child handles in a Map so we never "wipe" them by accident
  // const handlesRef = useRef<Map<string, YtTrackHandle>>(new Map());

  // Prime newly appended pages (optional – doesn’t block UI)
  // const prevCountRef = useRef(0);
  /*useEffect(() => {
    const count = tracks.length;
    if (count <= prevCountRef.current) return;
    const newIds = new Set(tracks.slice(prevCountRef.current).map((v) => v.id));
    prevCountRef.current = count;

    (async () => {
      await new Promise((r) => setTimeout(r, 0));
      const newHandles = Array.from(handlesRef.current.entries())
        .filter(([id]) => newIds.has(id))
        .map(([_, h]) => h);
      await Promise.allSettled(newHandles.map((h) => h.prime()));
    })();
  }, [tracks]);*/

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

  return (
    <div className="h-screen w-full flex flex-col p-6 pt-24 gap-6 overflow-hidden bg-[#371A4D] text-white">
      <div className="flex-1 overflow-y-auto pb-24 relative">
        {isLoading && (
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

        {isError && !isLoading && (
          <div className="py-10 text-center text-red-300">
            {(error as Error)?.message || "Failed to load tracks"}
          </div>
        )}

        {!isLoading && tracks.length === 0 && (
          <div className="py-10 text-center opacity-80">
            No tracks for “{decodeURIComponent(query)}”.
          </div>
        )}

        {tracks.length > 0 && (
          <>
            <RenderTracks mode={mode as Mode} tracks={tracks} query={query} />

            <div
              ref={sentinelRef}
              className="h-10 flex items-center justify-center"
            >
              {isFetchingNextPage ? (
                <span className="text-sm opacity-70">Loading more…</span>
              ) : !hasNextPage && tracks.length > 0 ? (
                <span className="text-xs opacity-50">No more results</span>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
