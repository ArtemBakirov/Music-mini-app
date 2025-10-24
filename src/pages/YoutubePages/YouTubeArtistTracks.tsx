// pages/YouTubeArtistTracks.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchChannelVideos } from "../../api/youtubeApi";
import { DisplayYoutubeSongCard } from "../../components/DisplayYoutubeSongCard";
import { useYoutubeChannelMeta } from "../../hooks/query/youtube.queries.ts";
import { YouTubeArtistBanner } from "./YouTubeArtistBanner.tsx";
import Play from "../../assets/icons/play.svg?react";
import {
  useSavedMap,
  useToggleSave,
} from "../../hooks/query/library.queries.ts";
import { useAccountStore } from "../../hooks/stores/useAccountStore.ts";

export default function YouTubeArtistTracks() {
  const { channelId = "" } = useParams();
  const YT_API_KEY =
    import.meta.env.VITE_YT_API_KEY ||
    "AIzaSyCUpYD21lRefE6F_WuO993Z4ityPj3aQdw";
  // console.log("chanel id", channelId);
  const {
    data: meta,
    isLoading,
    isError,
  } = useYoutubeChannelMeta(YT_API_KEY, channelId);

  console.log("data meta chanel", meta, isLoading, isError);

  const [pages, setPages] = useState<any[][]>([]);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const profile = useAccountStore((s) => s.profile);
  const address = profile?.address || "";

  const batchKeyIds = [channelId];
  // console.log("batchedkeyIds", batchKeyIds);
  const { data: savedMap } = useSavedMap(address, "artist", batchKeyIds);
  // console.log("savedMap", savedMap);
  const isSaved = savedMap?.[channelId] ?? false;
  // console.log("isSaved footer", isSaved);
  const { mutate, isPending, data, error } = useToggleSave();
  // console.log("mutation is pending", isPending);

  const handleAddToLibrary = () => {
    console.log("add artist to library");
    if (channelId) {
      if (isSaved) {
        // console.log("removing");
        mutate({
          channelId,
          address: profile.address || "",
          action: "remove",
          kind: "artist",
        });
      } else {
        // console.log("adding");
        mutate({
          channelId,
          address: profile.address || "",
          action: "add",
          kind: "artist",
        });
      }
    }
  };

  // load first page
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!channelId) return;
      setLoading(true);
      setErr(null);
      try {
        const { items, nextPageToken } = await fetchChannelVideos(
          YT_API_KEY,
          channelId,
          undefined,
          24,
        );
        if (!cancelled) {
          setPages([items]);
          setNextToken(nextPageToken);
        }
      } catch (e: any) {
        if (!cancelled) setErr(e.message ?? "Failed to load channel videos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [channelId]);

  const videos = useMemo(() => pages.flat(), [pages]);

  const hasNextPage = Boolean(nextToken);
  const isFetchingNextPage = loading && pages.length > 0;

  const loadMore = async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    setLoading(true);
    try {
      const { items, nextPageToken } = await fetchChannelVideos(
        YT_API_KEY,
        channelId,
        nextToken,
        24,
      );
      setPages((prev) => [...prev, items]);
      setNextToken(nextPageToken);
    } catch (e: any) {
      setErr(e.message ?? "Failed to load more");
    } finally {
      setLoading(false);
    }
  };

  // infinite observer
  const observer = useRef<IntersectionObserver | null>(null);
  const lastRef = (node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) loadMore();
    });
    if (node) observer.current.observe(node);
  };

  if (!channelId) return <div className="p-6 mt-16">No channel.</div>;
  if (err) return <div className="p-6 mt-16 text-red-400">{err}</div>;
  if (loading && pages.length === 0)
    return <div className="p-6 mt-16">Loading…</div>;

  return (
    <div className="h-screen overflow-hidden w-full flex flex-col p-6 mt-16 gap-6 text-white bg-[#371A4D]">
      {/* HERO BANNER */}
      <section className="relative w-full h-56 sm:h-64 md:h-80 lg:h-96 overflow-hidden">
        {/* Background video or image */}
        {meta?.unsubscribedTrailer ? (
          <>
            <YouTubeArtistBanner videoId={meta.unsubscribedTrailer} />
            {/* subtle dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : meta?.banner ? (
          <>
            <img
              src={meta.banner}
              alt={`${meta.title} banner`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D0F3A] to-[#371A4D]" />
        )}

        {/* Foreground content */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 pb-5 flex items-end justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {meta?.avatar && (
                <img
                  src={meta.avatar}
                  alt={`${meta.title} avatar`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight truncate">
                  {meta?.title ?? "Channel"}
                </h1>
                {/* You can add stats/subscriber count if you fetch them */}
              </div>
            </div>

            {/* Example actions (customize for your app) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleAddToLibrary}
                className="bg-white text-black rounded-full px-4 py-2 text-sm hover:opacity-90"
              >
                {isSaved ? "- Remove from Library" : "+ Add to Library"}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
              >
                {<Play />}
              </button>
            </div>
          </div>
        </div>
      </section>

      <h1 className="text-xl font-bold">Channel</h1>

      <div className="overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {videos.map((v, idx) => {
          const isLast = idx === videos.length - 1;
          return (
            <div key={idx} ref={isLast ? lastRef : undefined}>
              <DisplayYoutubeSongCard song={v} allTracks={videos} />
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div className="text-sm opacity-70">Loading more…</div>
      )}
      {!hasNextPage && videos.length > 0 && (
        <div className="text-sm opacity-70">No more results</div>
      )}
    </div>
  );
}
