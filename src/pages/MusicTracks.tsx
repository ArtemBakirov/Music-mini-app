// src/pages/MusicTracks.tsx
import { useParams } from "react-router-dom";
import { useJamendoTracksInfinite } from "../hooks/query/jamendo.queries";
import { DisplayJamendoSongCard } from "../components/DisplayJamendoSongCard";
import { useMemo, useRef, useEffect } from "react";

export const MusicTracks = () => {
  const { query } = useParams();
  const searchQuery = query ?? "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useJamendoTracksInfinite(searchQuery, 24);

  // flatten all pages
  const tracks = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data],
  );

  // IntersectionObserver sentinel
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "300px 0px", // start loading a bit before the user hits the bottom
        threshold: 0,
      },
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="h-screen w-full flex flex-col p-6 mt-16 mb-18 gap-6 overflow-hidden">
      <h1 className="text-2xl font-bold">Tracks</h1>

      {/* scrollable content area with bottom padding so footer doesn't overlap */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* loading & error states */}
        {isLoading && (
          <div className="py-10 text-center text-sm opacity-80">Loading…</div>
        )}
        {isError && (
          <div className="py-10 text-center text-red-300">
            {(error as Error)?.message || "Failed to load tracks"}
          </div>
        )}

        {/* empty state */}
        {!isLoading && !isError && tracks.length === 0 && (
          <div className="py-10 text-center opacity-80">
            No tracks for “{searchQuery}”.
          </div>
        )}

        {/* grid */}
        {tracks.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {tracks.map((track, idx) => (
                <div key={track.id}>
                  <DisplayJamendoSongCard
                    songData={track}
                    idx={idx}
                    allTracks={tracks} // so your card can set the queue when playing
                  />
                </div>
              ))}
            </div>

            {/* sentinel at the end */}
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
};
