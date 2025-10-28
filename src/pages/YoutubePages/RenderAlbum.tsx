import { useParams } from "react-router-dom";
import {
  useYoutubePlaylistItemsInfinite,
  useYoutubePlaylistMeta,
} from "../../hooks/query/youtube.queries.ts";
import Play from "../../assets/icons/play.svg?react";
import { useAccountStore } from "../../hooks/stores/useAccountStore.ts";
import { RenderTracks } from "./RenderTracks.tsx";
import { useEffect, useMemo, useRef } from "react";

export const RenderAlbum = () => {
  const { query = "" } = useParams();
  const YT_API_KEY =
    import.meta.env.VITE_YT_API_KEY ||
    "AIzaSyCUpYD21lRefE6F_WuO993Z4ityPj3aQdw";

  const {
    data: videosData,
    isLoading: isLoadingVideos,
    isError: isErrorVideos,
    fetchNextPage: fetchNextVideosPage,
    hasNextPage: hasNextVideosPage,
    isFetchingNextPage: isFetchingNextVideosPage,
  } = useYoutubePlaylistItemsInfinite(YT_API_KEY, query, 24);
  console.log("Album videoDatas", videosData);

  const {
    data: metaData,
    isLoading: isMetaLoading,
    isError: isMetaError,
    error: metaError,
  } = useYoutubePlaylistMeta(YT_API_KEY, query);

  console.log("metaData", metaData);

  const artwork =
    metaData?.thumbnails.maxres ||
    metaData?.thumbnails.high ||
    metaData?.thumbnails.medium ||
    metaData?.thumbnails.default ||
    "";
  const year = metaData?.publishedAt
    ? new Date(metaData.publishedAt).getFullYear()
    : "";

  const profile = useAccountStore((s) => s.profile);
  const address = profile?.address || "";

  const videos = useMemo(
    () => videosData?.pages.flatMap((p) => p.items) ?? [],
    [videosData],
  );

  const tracks = videos.map(({ videoId, ...rest }) => {
    return {
      ...rest,
      audioId: videoId,
    };
  });

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          hasNextVideosPage &&
          !isFetchingNextVideosPage
        ) {
          void fetchNextVideosPage();
        }
      },
      { root: null, rootMargin: "300px 0px", threshold: 0 },
    );

    io.observe(el);
    return () => io.unobserve(el);
  }, [fetchNextVideosPage, hasNextVideosPage, isFetchingNextVideosPage]);

  return (
    <div className="h-screen overflow-hidden w-full flex flex-col gap-6 text-white bg-[#371A4D]">
      {/* HERO BANNER */}
      {metaData && (
        <section className="bg-black/20 rounded-xl p-6 px-24 flex gap-6">
          {/* Artwork */}
          <div className="flex-shrink-0">
            {isMetaLoading ? (
              <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white/10 animate-pulse rounded-lg" />
            ) : artwork ? (
              <img
                src={artwork}
                alt={metaData?.title ?? "Playlist"}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-lg object-cover"
              />
            ) : (
              <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white/10 rounded-lg" />
            )}
          </div>

          {/* Text + actions */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            {isMetaLoading ? (
              <>
                <div className="h-6 w-56 bg-white/10 animate-pulse rounded mb-2" />
                <div className="h-4 w-40 bg-white/10 animate-pulse rounded mb-1" />
                <div className="h-4 w-24 bg-white/10 animate-pulse rounded" />
              </>
            ) : isMetaError ? (
              <div className="text-red-400">{metaError.message}</div>
            ) : metaData ? (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold truncate">
                  {metaData.title}
                </h1>
                <div className="text-pink-300 font-semibold truncate">
                  {metaData.channelTitle}
                </div>
                <div className="text-sm opacity-80">
                  {year && <span className="mr-2">{year}</span>}
                  {metaData.itemCount} Titel
                </div>
                {metaData.description && (
                  <p className="mt-3 text-sm opacity-90 line-clamp-3">
                    {metaData.description}
                  </p>
                )}

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
                  >
                    {<Play />}
                  </button>
                </div>
              </>
            ) : null}
          </div>
          {/* isLoadingMeta && (
          <div className="p-6 mt-16 text-white">Loading channel meta…</div>
            ) */}
          {/* isErrorMeta && (
          <div className="p-6 mt-16 text-red-400">
            Failed to load channel meta
          </div>
            ) */}
        </section>
      )}
      <div className="overflow-y-auto p-6 mb-24 flex flex-col gap-6">
        {tracks && <RenderTracks tracks={tracks} query={query} />}
        <div
          ref={sentinelRef}
          className="h-10 flex items-center justify-center"
        >
          {isFetchingNextVideosPage ? (
            <span className="text-sm opacity-70">Loading more…</span>
          ) : !hasNextVideosPage && tracks.length > 0 ? (
            <span className="text-xs opacity-50">No more results</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
