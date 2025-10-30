import { useLibrary } from "../../hooks/query/library.queries.ts";
import { useAccountStore } from "../../hooks/stores/useAccountStore.ts";
import { DisplayYoutubeSongCard } from "../../components/DisplayYoutubeSongCard.tsx";
import { RenderTracks } from "../YoutubePages/RenderTracks.tsx";
import { Mode } from "../../types/youtube.types.ts";
// Optionally hydrate from YT for fresh metadata (see notes below).

export const MyLibraryTracks = () => {
  const profile = useAccountStore((s) => s.profile);
  const address = profile.address || "";

  const { data, isLoading, isError } = useLibrary(address, "track", 1, 50);

  console.log("data", data);

  const allTracks = data?.items.map((item) => {
    return {
      ...item.meta,
      audioId: item.videoId,
      thumbnail: item.meta.thumbnails.default,
    };
  });

  console.log("alltracks", allTracks);

  if (isLoading) return <div className="p-6">Loading…</div>;
  if (isError) return <div className="p-6 text-red-400">Failed to load.</div>;

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

        {/* isError && !isLoading && (
          <div className="py-10 text-center text-red-300">
            {(error as Error)?.message || "Failed to load tracks"}
          </div>
        )*/}

        {/*!isLoading && tracks.length === 0 && (
          <div className="py-10 text-center opacity-80">
            No tracks for “{decodeURIComponent(query)}”.
          </div>
        )*/}

        {allTracks && allTracks.length > 0 && (
          <>
            <RenderTracks tracks={allTracks} />

            {/*<div
              ref={sentinelRef}
              className="h-10 flex items-center justify-center"
            >
              {isFetchingNextPage ? (
                <span className="text-sm opacity-70">Loading more…</span>
              ) : !hasNextPage && tracks.length > 0 ? (
                <span className="text-xs opacity-50">No more results</span>
              ) : null}
            </div>*/}
          </>
        )}
      </div>
    </div>
  );
};
