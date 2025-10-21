// pages/YouTubeArtistTracks.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchChannelVideos } from "../../api/youtubeApi";
import { DisplayYoutubeSongCard } from "../../components/DisplayYoutubeSongCard";

export default function YouTubeArtistTracks() {
  const { channelId = "" } = useParams();
  const YT_API_KEY =
    import.meta.env.VITE_YT_API_KEY ||
    "AIzaSyCUpYD21lRefE6F_WuO993Z4ityPj3aQdw";
  console.log("chanel id", channelId);

  const [pages, setPages] = useState<any[][]>([]);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
    <div className="h-screen overflow-hidden w-full flex flex-col p-6 mt-16 gap-6">
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
